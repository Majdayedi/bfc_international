package bfc.bfc.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    /** Optional French / Arabic versions of the title (content localization). */
    private String titleFr;

    private String titleAr;

    private String category;

    private String client;

    private String country;

    @Column(name = "representative_slug")
    private String representativeSlug;

    private String flag;

    private String year;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String descriptionFr;

    @Column(columnDefinition = "LONGTEXT")
    private String descriptionAr;

    private String accent;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(columnDefinition = "LONGTEXT")
    private String clientImageUrl;

    private String startDate;

    private String endDate;

    @Column(columnDefinition = "LONGTEXT")
    private String contentJson;

    @Column(columnDefinition = "LONGTEXT")
    private String contentJsonFr;

    @Column(columnDefinition = "LONGTEXT")
    private String contentJsonAr;
}
