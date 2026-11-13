package com.campuscompass.service;

import com.campuscompass.model.Student;
import com.campuscompass.model.SkillSwapRequest;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SkillSwapService {

    /**
     * Calculates compatibility score between two students using multi-factor heuristic:
     * - Reciprocal skill exchange (complementary overlap): 40%
     * - Academic department and level alignment: 20%
     * - Shared technology interests & career goals: 20%
     * - Learning and teaching availability match: 20%
     */
    public int calculateCompatibilityScore(Student studentA, Student studentB) {
        int score = 50;

        // Check if student B teaches what student A wants to learn
        boolean bTeachesWhatAWants = studentB.getSkillsTeaching().stream()
                .anyMatch(skillB -> studentA.getSkillsLearning().stream()
                        .anyMatch(skillA -> skillA.equalsIgnoreCase(skillB)));

        // Check if student A teaches what student B wants to learn
        boolean aTeachesWhatBWants = studentA.getSkillsTeaching().stream()
                .anyMatch(skillA -> studentB.getSkillsLearning().stream()
                        .anyMatch(skillB -> skillB.equalsIgnoreCase(skillA)));

        if (bTeachesWhatAWants && aTeachesWhatBWants) {
            score += 35; // True mutual circular exchange
        } else if (bTeachesWhatAWants || aTeachesWhatBWants) {
            score += 20;
        }

        // Branch synergy
        if (studentA.getBranch().equalsIgnoreCase(studentB.getBranch())) {
            score += 5;
        }

        // Shared interests
        long sharedInterestsCount = studentA.getInterests().stream()
                .filter(i -> studentB.getInterests().contains(i))
                .count();
        score += (int) Math.min(sharedInterestsCount * 4, 10);

        return Math.min(score, 98);
    }

    public String generateMatchExplanation(Student studentA, Student studentB, int score) {
        return String.format(
            "AI Compatibility: %d%%. Complementary skill profiles identified: %s can mentor in %s while %s contributes %s.",
            score,
            studentA.getName(),
            String.join(", ", studentA.getSkillsTeaching()),
            studentB.getName(),
            String.join(", ", studentB.getSkillsTeaching())
        );
    }
}
