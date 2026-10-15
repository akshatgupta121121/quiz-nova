package com.quiznova.service;

import com.quiznova.dao.UserDAO;
import com.quiznova.exception.AuthenticationException;
import com.quiznova.model.Student;
import com.quiznova.model.User;
import com.quiznova.model.UserRole;
import com.quiznova.util.Result;

import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

/**
 * Concept: Service Layer & Authentication Validation
 */
public class AuthService {

    private final UserDAO userDAO = new UserDAO();

    /**
     * Authenticates a user by email and password.
     */
    public Result<User> login(String email, String password) {
        if (email == null || password == null) {
            return Result.failure("Email and password are required.", 400);
        }

        try {
            Optional<User> userOpt = userDAO.findByEmail(email.trim());
            if (userOpt.isEmpty()) {
                throw new AuthenticationException("Invalid email or password.");
            }

            User user = userOpt.get();
            // Validate password match
            if (!password.equals(user.getPasswordHash())) {
                throw new AuthenticationException("Invalid email or password.");
            }

            return Result.success(user);
        } catch (AuthenticationException ae) {
            return Result.failure(ae.getMessage(), ae.getStatusCode());
        } catch (SQLException e) {
            return Result.failure("Database error during authentication: " + e.getMessage(), 500);
        }
    }

    /**
     * Registers a new student or admin.
     */
    public Result<User> register(String name, String email, String password, UserRole role) {
        if (name == null || name.trim().isEmpty() || email == null || !email.contains("@")) {
            return Result.failure("Valid name and email are required.", 400);
        }
        if (password == null || password.length() < 6) {
            return Result.failure("Password must be at least 6 characters.", 400);
        }

        try {
            Optional<User> existing = userDAO.findByEmail(email.trim());
            if (existing.isPresent()) {
                return Result.failure("An account with this email address already exists.", 409);
            }

            String userId = "u_" + (role == UserRole.ADMIN ? "admin_" : "student_") + UUID.randomUUID().toString().substring(0, 8);
            User user;
            if (role == UserRole.ADMIN) {
                user = new User(userId, name.trim(), email.trim().toLowerCase(), password, UserRole.ADMIN);
            } else {
                user = new Student(userId, name.trim(), email.trim().toLowerCase(), password);
            }

            boolean ok = userDAO.insert(user);
            if (!ok) {
                return Result.failure("Failed to create user account.", 500);
            }

            return Result.success(user, 201);
        } catch (SQLException e) {
            return Result.failure("Database error during registration: " + e.getMessage(), 500);
        }
    }
}
