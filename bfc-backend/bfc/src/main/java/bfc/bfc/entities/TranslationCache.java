package bfc.bfc.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Cache of machine translations so each unique source text is translated by
 * Azure only once per target language. Rows are keyed by a SHA-256 hash of the
 * source text plus the target language.
 */
@Entity
@Table(
    name = "translation_cache",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_translation_lang_hash", columnNames = {"target_language", "source_hash"})
    },
    indexes = {
        @Index(name = "idx_translation_hash", columnList = "source_hash")
    }
)
public class TranslationCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Target language code, e.g. "fr", "ar", "es". */
    @Column(name = "target_language", nullable = false, length = 8)
    private String targetLanguage;

    /** SHA-256 hex of the source text. */
    @Column(name = "source_hash", nullable = false, length = 64)
    private String sourceHash;

    @Column(name = "source_text", nullable = false, columnDefinition = "TEXT")
    private String sourceText;

    @Column(name = "source_language", nullable = false, length = 8)
    private String sourceLanguage;

    @Column(name = "translated_text", nullable = false, columnDefinition = "TEXT")
    private String translatedText;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public TranslationCache() {}

    public TranslationCache(String targetLanguage, String sourceHash, String sourceText,
                            String sourceLanguage, String translatedText) {
        this.targetLanguage = targetLanguage;
        this.sourceHash = sourceHash;
        this.sourceText = sourceText;
        this.sourceLanguage = sourceLanguage;
        this.translatedText = translatedText;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
    }

    public String getSourceHash() {
        return sourceHash;
    }

    public void setSourceHash(String sourceHash) {
        this.sourceHash = sourceHash;
    }

    public String getSourceText() {
        return sourceText;
    }

    public void setSourceText(String sourceText) {
        this.sourceText = sourceText;
    }

    public String getSourceLanguage() {
        return sourceLanguage;
    }

    public void setSourceLanguage(String sourceLanguage) {
        this.sourceLanguage = sourceLanguage;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
