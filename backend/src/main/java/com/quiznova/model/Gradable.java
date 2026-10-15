package com.quiznova.model;

/**
 * Concept: OOP - Interface & Polymorphism
 * 
 * Defines the contract for any entity that can be evaluated, graded,
 * and ranked within the QuizNova performance engine.
 */
public interface Gradable {

    /**
     * Calculates the letter grade (A, B, C, D, F) based on performance percentage.
     * Demonstrates: Interface method contract & Polymorphism.
     *
     * @param percentage Score percentage between 0.0 and 100.0
     * @return Letter grade
     */
    String calculateGrade(double percentage);

    /**
     * Determines whether the entity has satisfied the passing benchmark.
     *
     * @param score Attained score
     * @param passScore Minimum score required to pass
     * @return true if passed, false otherwise
     */
    default boolean isPassing(double score, double passScore) {
        return score >= passScore;
    }
}
