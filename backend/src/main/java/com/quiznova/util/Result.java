package com.quiznova.util;

/**
 * Concept: Java Generics & Functional Encapsulation
 * 
 * Generic wrapper type representing either a successful outcome containing data of type T,
 * or an error outcome containing diagnostic status and error message.
 *
 * @param <T> The payload data type
 */
public class Result<T> {

    private final boolean success;
    private final T data;
    private final String errorMessage;
    private final int statusCode;

    // Private constructor enforcing static factory methods
    private Result(boolean success, T data, String errorMessage, int statusCode) {
        this.success = success;
        this.data = data;
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
    }

    /**
     * Static Generic Factory for successful operations
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(true, data, null, 200);
    }

    public static <T> Result<T> success(T data, int statusCode) {
        return new Result<>(true, data, null, statusCode);
    }

    /**
     * Static Generic Factory for error operations
     */
    public static <T> Result<T> failure(String errorMessage, int statusCode) {
        return new Result<>(false, null, errorMessage, statusCode);
    }

    public boolean isSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
