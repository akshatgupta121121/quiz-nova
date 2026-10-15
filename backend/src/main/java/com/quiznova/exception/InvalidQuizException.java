package com.quiznova.exception;

/**
 * Concept: Custom Business Exception Handling
 * 
 * Thrown when a quiz fails structural validation (e.g. less than 1 question,
 * invalid duration, or missing pass benchmark).
 */
public class InvalidQuizException extends QuizNovaException {

    public InvalidQuizException(String message) {
        super(message, 400); // HTTP 400 Bad Request
    }
}
