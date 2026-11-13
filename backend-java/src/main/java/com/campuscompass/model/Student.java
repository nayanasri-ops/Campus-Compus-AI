package com.campuscompass.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String branch;

    private String college;
    private Integer year;
    private Integer semester;
    private Double cgpa;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String careerGoal;
    private String preferredMode;
    private String availability;

    @ElementCollection
    @CollectionTable(name = "student_skills_teaching", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill_name")
    private List<String> skillsTeaching = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "student_skills_learning", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill_name")
    private List<String> skillsLearning = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "student_interests", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "interest")
    private List<String> interests = new ArrayList<>();

    private Integer xp = 1000;
    private Integer streak = 1;
    private Double placementReadiness = 75.0;
}
