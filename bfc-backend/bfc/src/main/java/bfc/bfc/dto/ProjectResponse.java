package bfc.bfc.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String titleFr;
    private String titleAr;
    private String category;
    private String client;
    private String country;
    private String representativeSlug;
    private String flag;
    private String year;
    private String description;
    private String descriptionFr;
    private String descriptionAr;
    private String accent;
    private String imageUrl;
    private String clientImageUrl;
    private String startDate;
    private String endDate;
    private String contentJson;
    private String contentJsonFr;
    private String contentJsonAr;
    private List<ArticleResponse> relatedArticles;
}
