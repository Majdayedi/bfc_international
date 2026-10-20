package bfc.bfc.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    /** Optional French / Arabic versions of the title (content localization). */
    private String titleFr;

    private String titleAr;

    private String subtitle;

    private String subtitleFr;

    private String subtitleAr;

    @Column(nullable = false, unique = true)
    private String slug;

    private String category;

    private String author;

    private String publishDate;

    private String readingTime;

    @Column(length = 2000)
    private String summary;

    @Column(length = 2000)
    private String summaryFr;

    @Column(length = 2000)
    private String summaryAr;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String heroImage;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String contentJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentJsonFr;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentJsonAr;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isTopArticle;
}
