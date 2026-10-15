package com.quiznova.model;

/**
 * Concept: OOP - Entity Mapping
 * 
 * Maps to 'attempt_answers' table, recording specific candidate choice per question.
 */
public class AttemptAnswer {

    private String id;
    private String attemptId;
    private String questionId;
    private Integer selectedOptionIndex; // null if skipped
    private boolean correct;

    public AttemptAnswer() {
    }

    public AttemptAnswer(String id, String attemptId, String questionId, Integer selectedOptionIndex, boolean correct) {
        this.id = id;
        this.attemptId = attemptId;
        this.questionId = questionId;
        this.selectedOptionIndex = selectedOptionIndex;
        this.correct = correct;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(String attemptId) {
        this.attemptId = attemptId;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public Integer getSelectedOptionIndex() {
        return selectedOptionIndex;
    }

    public void setSelectedOptionIndex(Integer selectedOptionIndex) {
        this.selectedOptionIndex = selectedOptionIndex;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}
