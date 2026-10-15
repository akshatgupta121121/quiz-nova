package com.quiznova.model;

/**
 * Concept: OOP - Encapsulation
 * 
 * Represents an individual MCQ question with 4 options, a code snippet,
 * correct index, and Java Language Specification explanation.
 */
public class Question {

    private String id;
    private String quizId;
    private String questionText;
    private String codeSnippet;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private int correctOptionIndex; // 0=A, 1=B, 2=C, 3=D
    private String explanation;
    private int marks;

    public Question() {
    }

    public Question(String id, String quizId, String questionText, String codeSnippet,
                    String optionA, String optionB, String optionC, String optionD,
                    int correctOptionIndex, String explanation, int marks) {
        this.id = id;
        this.quizId = quizId;
        this.questionText = questionText;
        this.codeSnippet = codeSnippet;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctOptionIndex = correctOptionIndex;
        this.explanation = explanation;
        this.marks = marks;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getCodeSnippet() {
        return codeSnippet;
    }

    public void setCodeSnippet(String codeSnippet) {
        this.codeSnippet = codeSnippet;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public int getCorrectOptionIndex() {
        return correctOptionIndex;
    }

    public void setCorrectOptionIndex(int correctOptionIndex) {
        if (correctOptionIndex < 0 || correctOptionIndex > 3) {
            throw new IllegalArgumentException("Correct option index must be between 0 and 3");
        }
        this.correctOptionIndex = correctOptionIndex;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public int getMarks() {
        return marks;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    public String[] getOptionsArray() {
        return new String[]{optionA, optionB, optionC, optionD};
    }
}
