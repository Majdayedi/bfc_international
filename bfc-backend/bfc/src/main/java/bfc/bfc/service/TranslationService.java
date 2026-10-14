package bfc.bfc.service;

import bfc.bfc.entities.TranslationCache;
import bfc.bfc.repository.TranslationCacheRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

/**
 * Machine translation via the Azure AI Translator v3 REST API. Every
 * translated string is persisted in the translation_cache table so the exact
 * same source text is only ever sent to Azure once per target language — this
 * keeps the service comfortably inside the free F0 tier (2M chars/month).
 *
 * <p>Configuration (application.properties or environment variables):
 * <pre>
 * app.azure.translator.key      = the "Key 1" value of the Translator resource
 * app.azure.translator.region   = the resource region, e.g. "westeurope"
 * app.azure.translator.endpoint = https://api.cognitive.microsofttranslator.com
 * </pre>
 *
 * <p>If the key is not configured the service degrades gracefully: it logs a
 * warning and returns the source texts unchanged instead of failing requests.
 */
@Service
public class TranslationService {

    private static final Logger log = LoggerFactory.getLogger(TranslationService.class);

    /** Azure v3 API limits: max items per request and max characters per request. */
    private static final int MAX_TEXTS_PER_REQUEST = 100;
    private static final int MAX_CHARS_PER_REQUEST = 50_000;

    /** Languages this service may translate between. */
    private static final List<String> ALLOWED_TARGET_LANGUAGES = List.of("fr", "ar", "es");
    private static final List<String> ALLOWED_SOURCE_LANGUAGES = List.of("en");

    private final TranslationCacheRepository cacheRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final String apiKey;
    private final String apiKeyRegion;
    private final String endpoint;

    /** Self-hosted LibreTranslate base URL, e.g. http://localhost:5000. Used
     *  when no Azure key is configured — unlimited and free. */
    private final String libreUrl;

    /** Cached LibreTranslate health-check state (checked at most once per minute). */
    private volatile long lastLibreHealthCheckMs;
    private volatile boolean lastLibreHealthy;

    public TranslationService(
            TranslationCacheRepository cacheRepository,
            @Value("${app.azure.translator.key:}") String apiKey,
            @Value("${app.azure.translator.region:}") String apiKeyRegion,
            @Value("${app.azure.translator.endpoint:https://api.cognitive.microsofttranslator.com}") String endpoint,
            @Value("${app.translation.libretranslate.url:}") String libreUrl) {
        this.cacheRepository = cacheRepository;
        this.apiKey = apiKey;
        this.apiKeyRegion = apiKeyRegion;
        this.endpoint = endpoint;
        this.libreUrl = libreUrl;
    }

    /** True when the active provider is ready to translate. */
    public boolean isConfigured() {
        if (isAzureConfigured()) {
            return true;
        }
        return isLibreTranslateAvailable();
    }

    public boolean isAzureConfigured() {
        return apiKey != null && !apiKey.isBlank() && apiKeyRegion != null && !apiKeyRegion.isBlank();
    }

    /** LibreTranslate counts as available only when its container actually
     *  answers — so a stopped container makes the API report configured:false
     *  and the frontend refuses to cache originals as "translations". */
    private boolean isLibreTranslateAvailable() {
        if (libreUrl == null || libreUrl.isBlank()) {
            return false;
        }
        long now = System.currentTimeMillis();
        if (now - lastLibreHealthCheckMs > 60_000) {
            lastLibreHealthCheckMs = now;
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(libreUrl + "/languages"))
                        .timeout(Duration.ofSeconds(3))
                        .GET()
                        .build();
                HttpResponse<String> response =
                        httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                lastLibreHealthy = response.statusCode() == 200;
            } catch (Exception e) {
                lastLibreHealthy = false;
            }
        }
        return lastLibreHealthy;
    }

    /**
     * Translates a batch of texts, serving from the DB cache first and calling
     * Azure only for texts that have never been translated before. The result
     * list is aligned 1:1 with the input list; on any failure the original
     * texts are returned so the caller never breaks.
     */
    public List<String> translateBatch(List<String> texts, String to, String from) {
        String target = normalizeLanguage(to, ALLOWED_TARGET_LANGUAGES);
        String source = normalizeLanguage(from, ALLOWED_SOURCE_LANGUAGES);

        if (target == null) {
            return texts;
        }

        List<String> result = new ArrayList<>(texts.size());
        List<String> missingTexts = new ArrayList<>();
        List<Integer> missingIndices = new ArrayList<>();

        // Pass 1: resolve from DB cache, collect what is missing.
        for (int i = 0; i < texts.size(); i++) {
            String text = texts.get(i);
            if (text == null || text.isBlank()) {
                result.add(text);
                continue;
            }
            try {
                String hash = sha256(text);
                var cached = cacheRepository.findByTargetLanguageAndSourceHash(target, hash);
                if (cached.isPresent()) {
                    result.add(cached.get().getTranslatedText());
                    continue;
                }
            } catch (Exception e) {
                log.warn("Translation cache lookup failed, keeping source text for index {}", i, e);
                result.add(text);
                continue;
            }
            missingTexts.add(text);
            missingIndices.add(i);
            result.add(null); // placeholder, filled in pass 2
        }

        // Pass 2: call the active provider for the missing ones and persist.
        if (!missingTexts.isEmpty()) {
            Map<String, String> fresh = callProvider(missingTexts, target, source);

            // When the provider failed entirely, showing originals is fine —
            // but persisting them would poison the cache permanently, so we
            // only save results from a provider that actually answered.
            boolean providerFailed = fresh.isEmpty();

            List<TranslationCache> toSave = new ArrayList<>();
            for (int j = 0; j < missingTexts.size(); j++) {
                String text = missingTexts.get(j);
                String translated = null;
                try {
                    translated = fresh.get(sha256(text));
                } catch (Exception e) {
                    log.warn("Hashing failed while stitching results", e);
                }
                if (translated == null || translated.isBlank()) {
                    // Graceful degradation: show the original if the provider failed.
                    translated = text;
                }
                result.set(missingIndices.get(j), translated);
                if (!providerFailed) {
                    try {
                        toSave.add(new TranslationCache(target, sha256(text), text, source, translated));
                    } catch (Exception ignore) {
                        // hashing failure already logged above
                    }
                }
            }
            if (!toSave.isEmpty()) {
                try {
                    cacheRepository.saveAll(toSave);
                } catch (Exception e) {
                    log.warn("Failed to persist translations to cache (not fatal)", e);
                }
            }
        }

        return normalizeBlanks(result, texts);
    }

    /** Dispatches to the active provider: Azure key takes priority,
     * LibreTranslate otherwise. Returns a map keyed by SHA-256 of source text. */
    private Map<String, String> callProvider(List<String> texts, String target, String source) {
        if (isAzureConfigured()) {
            return callAzure(texts, target, source);
        }
        if (isLibreTranslateAvailable()) {
            return callLibreTranslate(texts, target, source);
        }
        log.warn("No translation provider available — set AZURE_TRANSLATOR_KEY+REGION, or start LibreTranslate at app.translation.libretranslate.url. Showing source text.");
        return Map.of();
    }

    /**
     * Calls a self-hosted LibreTranslate instance with chunk-splitting
     * (100 items / 25k characters per request). Returns a map keyed by
     * SHA-256 of the source text.
     */
    private Map<String, String> callLibreTranslate(List<String> texts, String target, String source) {
        Map<String, String> translations = new HashMap<>();

        int batchStart = 0;
        int batchChars = 0;

        for (int i = 0; i <= texts.size(); i++) {
            boolean flush = i == texts.size();
            if (!flush) {
                batchChars += texts.get(i).length();
                if (batchChars > 25_000 || (i - batchStart + 1) > MAX_TEXTS_PER_REQUEST) {
                    batchChars = 0;
                    flush = true;
                }
            }
            if (!flush) {
                continue;
            }
            if (i > batchStart) {
                List<String> chunk = texts.subList(batchStart, i);
                try {
                    translations.putAll(callLibreTranslateChunk(chunk, target, source));
                } catch (Exception e) {
                    log.warn("LibreTranslate call failed for a chunk of {} texts: {}",
                            chunk.size(), e.getMessage());
                }
            }
            batchStart = i;
        }
        return translations;
    }

    private Map<String, String> callLibreTranslateChunk(List<String> chunk, String target, String source)
            throws Exception {
        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("q", chunk.toArray(new String[0]));
        if (source != null) {
            bodyMap.put("source", source);
        }
        bodyMap.put("target", target);
        bodyMap.put("format", "text");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(libreUrl + "/translate"))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(
                        objectMapper.writeValueAsString(bodyMap), StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new IllegalStateException("LibreTranslate returned HTTP " + response.statusCode()
                    + ": " + truncateForLog(response.body()));
        }
        // Response shape (actual, verified): {"translatedText": ["...", "..."]}
        Map<String, String> byIndex = new HashMap<>();
        JsonNode translatedArray = objectMapper.readTree(response.body()).path("translatedText");
        for (int i = 0; i < chunk.size(); i++) {
            String text = translatedArray.path(i).asText(null);
            if (text != null && !text.isBlank()) {
                byIndex.put(sha256(chunk.get(i)), text);
            }
        }
        return byIndex;
    }

    /**
     * Calls Azure Translator v3 with chunk-splitting that respects both Azure
     * limits (100 items / 50k characters per request). Returns a map keyed by
     * SHA-256 of the source text.
     */
    private Map<String, String> callAzure(List<String> texts, String target, String source) {
        Map<String, String> translations = new HashMap<>();

        int batchStart = 0;
        int batchChars = 0;

        for (int i = 0; i <= texts.size(); i++) {
            boolean flush = i == texts.size();
            if (!flush) {
                batchChars += texts.get(i).length();
                if (batchChars > MAX_CHARS_PER_REQUEST || (i - batchStart + 1) > MAX_TEXTS_PER_REQUEST) {
                    batchChars = 0; // re-accumulate below for the new batch
                    flush = true;
                }
            }
            if (!flush) {
                continue;
            }
            if (i > batchStart) {
                List<String> chunk = texts.subList(batchStart, i);
                try {
                    translations.putAll(callAzureChunk(chunk, target, source));
                } catch (Exception e) {
                    log.warn("Azure call failed for a chunk of {} texts: {}",
                            chunk.size(), e.getMessage());
                }
            }
            batchStart = i;
        }

        return translations;
    }

    private Map<String, String> callAzureChunk(List<String> chunk, String target, String source) throws Exception {
        StringBuilder payload = new StringBuilder("[");
        for (int i = 0; i < chunk.size(); i++) {
            if (i > 0) {
                payload.append(',');
            }
            payload.append(objectMapper.writeValueAsString(Map.of("Text", chunk.get(i))));
        }
        payload.append(']');

        String url = endpoint + "/translate?api-version=3.0"
                + (source != null ? "&from=" + source : "")
                + "&to=" + target;

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(20))
                .header("Content-Type", "application/json")
                .header("Ocp-Apim-Subscription-Key", apiKey);

        // Global Translator resources must NOT send the region header
        // (Microsoft rejects it); only regional resources require it.
        boolean regional = apiKeyRegion != null && !apiKeyRegion.isBlank()
                && !"global".equalsIgnoreCase(apiKeyRegion);
        if (regional) {
            builder.header("Ocp-Apim-Subscription-Region", apiKeyRegion);
        }

        HttpRequest request = builder
                .POST(HttpRequest.BodyPublishers.ofString(payload.toString(), StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new IllegalStateException("Azure returned HTTP " + response.statusCode()
                    + ": " + truncateForLog(response.body()));
        }

        Map<String, String> byIndex = new HashMap<>();
        JsonNode items = objectMapper.readTree(response.body());
        for (int i = 0; i < chunk.size(); i++) {
            JsonNode item = items.get(i);
            if (item == null) {
                break;
            }
            JsonNode first = item.path("translations").path(0);
            String text = first.path("text").asText(null);
            if (text != null && !text.isBlank()) {
                byIndex.put(sha256(chunk.get(i)), text);
            }
        }
        return byIndex;
    }

    private String normalizeLanguage(String lang, List<String> allowed) {
        if (lang == null) {
            return null;
        }
        String lower = lang.toLowerCase().substring(0, Math.min(2, lang.length()));
        return allowed.contains(lower) ? lower : null;
    }

    private List<String> normalizeBlanks(List<String> result, List<String> fallbacks) {
        for (int i = 0; i < result.size(); i++) {
            if (result.get(i) == null) {
                result.set(i, fallbacks.get(i));
            }
        }
        return result;
    }

    private String sha256(String text) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = digest.digest(text.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(bytes);
    }

    private String truncateForLog(String body) {
        if (body == null) {
            return "";
        }
        return body.length() > 300 ? body.substring(0, 300) + "…" : body;
    }
}
