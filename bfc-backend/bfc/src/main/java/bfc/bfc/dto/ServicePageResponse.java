package bfc.bfc.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicePageResponse {
    private Long id;
    private String slug;
    private String title;
    private String subtitle;
    private String description;
    private String layoutType;
    private String contentJson;
    private Integer displayOrder;

    /* Content localization (FR/AR versions of the page). */
    private String titleFr;
    private String titleAr;
    private String subtitleFr;
    private String subtitleAr;
    private String descriptionFr;
    private String descriptionAr;
    private String contentJsonFr;
    private String contentJsonAr;
}
