package bfc.bfc.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleResponse {
    private Long id;
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
    private String contentJson;
    private String contentJsonFr;
    private String contentJsonAr;
    private boolean isTopArticle;
}
