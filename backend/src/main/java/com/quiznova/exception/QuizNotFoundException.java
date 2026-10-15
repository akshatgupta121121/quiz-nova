package com.quiznova.exception;

/**
 * Concept: Custom Business Exception Handling
 */
public class QuizNotFoundException extends QuizNovaException {

    public QuizNotFoundException(String quizId) {
        super("Quiz not found with identifier: " + quizId, 404); // HTTP 404 Not Found
    }
}
