package bfc.bfc.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Title is required")
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
}
