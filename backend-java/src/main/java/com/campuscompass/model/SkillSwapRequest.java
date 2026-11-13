package com.campuscompass.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_swap_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillSwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private Student sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Student receiver;

    @Column(nullable = false)
    private String skillOffered;

    @Column(nullable = false)
    private String skillRequested;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String availability;
    private String preferredMode; // Online, Offline, Both
    private Integer compatibilityScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillSwapStatus status = SkillSwapStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    private Integer ratingScore;
    private String ratingFeedback;

    public enum SkillSwapStatus {
        PENDING, ACCEPTED, REJECTED, COUNTERED, ACTIVE, COMPLETED
    }
}
