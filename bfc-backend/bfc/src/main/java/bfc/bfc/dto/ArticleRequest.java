package bfc.bfc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String titleFr;

    private String titleAr;

    private String subtitle;

    private String subtitleFr;

    private String subtitleAr;

    private String slug;

    private String category;

    private String author;

    private String publishDate;

    private String readingTime;

    private String summary;

    private String summaryFr;

    private String summaryAr;

    private String heroImage;

    @NotBlank(message = "Content JSON is required")
    private String contentJson;

    private String contentJsonFr;

    private String contentJsonAr;

    @JsonProperty("topArticle")
    private Boolean isTopArticle;
}
