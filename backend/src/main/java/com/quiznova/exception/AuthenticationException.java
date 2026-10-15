package com.quiznova.exception;

/**
 * Concept: Custom Business Exception Handling
 */
public class AuthenticationException extends QuizNovaException {

    public AuthenticationException(String message) {
        super(message, 401); // HTTP 401 Unauthorized
    }
}
