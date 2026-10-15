package com.quiznova.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Concept: OOP - Encapsulation & Aggregation
 * 
 * Represents an assessment topic in the syllabus. Aggregates a list of Question items.
 */
public class Quiz {

    private String id;
    private String title;
    private String description;
    private String category;
    private QuizDifficulty difficulty;
    private int durationMinutes;
    private double passPercentage;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Aggregation: A quiz contains questions
    private List<Question> questions = new ArrayList<>();

    public Quiz() {
    }

    public Quiz(String id, String title, String description, String category,
                QuizDifficulty difficulty, int durationMinutes, double passPercentage) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.difficulty = difficulty;
        this.durationMinutes = durationMinutes;
        this.passPercentage = passPercentage;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.updatedAt = this.createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public QuizDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(QuizDifficulty difficulty) {
        this.difficulty = difficulty;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(double passPercentage) {
        this.passPercentage = passPercentage;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
