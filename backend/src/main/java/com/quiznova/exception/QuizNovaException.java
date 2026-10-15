package com.quiznova.exception;

/**
 * Concept: Java Exception Handling
 * 
 * Root custom unchecked exception for the QuizNova domain.
 */
public class QuizNovaException extends RuntimeException {

    private final int statusCode;

    public QuizNovaException(String message) {
        super(message);
        this.statusCode = 500;
    }

    public QuizNovaException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public QuizNovaException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
