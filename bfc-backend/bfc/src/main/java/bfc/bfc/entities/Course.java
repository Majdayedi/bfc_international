package bfc.bfc.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String institution;
    private String country;
    private String year;
    private String category;

    @Column(columnDefinition = "LONGTEXT")
    private String topics;

    @Column(columnDefinition = "LONGTEXT")
    private String logo;

    private Boolean isAccredited;
    private String programs;
    private String accreditation;
    private String intake;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String certificationDescription;

    @Column(columnDefinition = "LONGTEXT")
    private String brochureUrl;

    @Column(columnDefinition = "LONGTEXT")
    private String intro;

    @Column(columnDefinition = "LONGTEXT")
    private String participants;

    private String duration;
    private String location;
    private String language;

    @ElementCollection
    @CollectionTable(name = "course_learn_points", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "point", columnDefinition = "LONGTEXT")
    private List<String> learnPoints;

    @ElementCollection
    @CollectionTable(name = "course_journey_steps", joinColumns = @JoinColumn(name = "course_id"))
    private List<JourneyStep> journeySteps;

    /* ================================================================
       CONTENT LOCALIZATION — French / Arabic versions of the editorial
       text. Lists are stored as JSON so each language owns its own copy.
       Empty/null means "no translated version" (the site falls back to
       the English field).
       ================================================================ */

    private String titleFr;
    private String titleAr;

    private String institutionFr;
    private String institutionAr;

    @Column(columnDefinition = "LONGTEXT")
    private String programsFr;

    @Column(columnDefinition = "LONGTEXT")
    private String programsAr;

    @Column(columnDefinition = "LONGTEXT")
    private String accreditationFr;

    @Column(columnDefinition = "LONGTEXT")
    private String accreditationAr;

    @Column(columnDefinition = "LONGTEXT")
    private String descriptionFr;

    @Column(columnDefinition = "LONGTEXT")
    private String descriptionAr;

    @Column(columnDefinition = "LONGTEXT")
    private String certificationDescriptionFr;

    @Column(columnDefinition = "LONGTEXT")
    private String certificationDescriptionAr;

    @Column(columnDefinition = "LONGTEXT")
    private String introFr;

    @Column(columnDefinition = "LONGTEXT")
    private String introAr;

    @Column(columnDefinition = "LONGTEXT")
    private String participantsFr;

    @Column(columnDefinition = "LONGTEXT")
    private String participantsAr;

    private String durationFr;
    private String durationAr;

    private String locationFr;
    private String locationAr;

    /** JSON arrays: ["point", ...] */
    @Column(columnDefinition = "LONGTEXT")
    private String learnPointsFr;

    @Column(columnDefinition = "LONGTEXT")
    private String learnPointsAr;

    /** JSON arrays: [{"title":"...","detail":"..."}, ...] */
    @Column(columnDefinition = "LONGTEXT")
    private String journeyStepsFr;

    @Column(columnDefinition = "LONGTEXT")
    private String journeyStepsAr;
}
