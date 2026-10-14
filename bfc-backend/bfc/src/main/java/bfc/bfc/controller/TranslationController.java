package bfc.bfc.controller;

import bfc.bfc.service.TranslationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Public translation endpoint used by the frontend to translate dynamic
 * (database-served) content on the fly. Backed by the Azure Translator free
 * tier with a MySQL translation cache, so repeated strings never re-bill.
 */
@RestController
@RequestMapping("/api/translate")
public class TranslationController {

    /** Request sanity limits — keeps abuse from burning the free quota. */
    private static final int MAX_TEXTS = 150;
    private static final int MAX_TEXT_LENGTH = 5_000;

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    public record TranslateRequest(List<String> texts, String to, String from) {}

    @PostMapping
    public ResponseEntity<Map<String, Object>> translate(@RequestBody TranslateRequest request) {
        if (request.texts() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "texts is required"));
        }
        if (request.texts().size() > MAX_TEXTS) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Maximum " + MAX_TEXTS + " texts per request"));
        }
        for (String text : request.texts()) {
            if (text != null && text.length() > MAX_TEXT_LENGTH) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Text exceeds the maximum length of " + MAX_TEXT_LENGTH + " chars"));
            }
        }

        List<String> translations =
                translationService.translateBatch(request.texts(), request.to(), request.from());

        return ResponseEntity.ok(Map.of(
                "translations", translations,
                "configured", translationService.isConfigured()
        ));
    }
}
