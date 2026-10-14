package bfc.bfc.repository;

import bfc.bfc.entities.TranslationCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TranslationCacheRepository extends JpaRepository<TranslationCache, Long> {

    Optional<TranslationCache> findByTargetLanguageAndSourceHash(String targetLanguage, String sourceHash);

    List<TranslationCache> findByTargetLanguageAndSourceHashIn(String targetLanguage, List<String> sourceHashes);
}
