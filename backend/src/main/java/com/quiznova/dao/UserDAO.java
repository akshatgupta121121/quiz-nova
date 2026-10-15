package com.quiznova.dao;

import com.quiznova.model.Admin;
import com.quiznova.model.Student;
import com.quiznova.model.User;
import com.quiznova.model.UserRole;
import com.quiznova.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Concept: JDBC - Data Access Object (DAO) Pattern, PreparedStatement, Try-With-Resources
 * 
 * Manages SQL persistence for the 'users' table.
 * Demonstrates: Polymorphic instantiation of Student and Admin based on database role ENUM.
 */
public class UserDAO {

    /**
     * Finds a user by their unique primary key ID.
     */
    public Optional<User> findById(String id) throws SQLException {
        String sql = "SELECT id, name, email, password_hash, role, avatar_url, created_at FROM users WHERE id = ?";

        // Try-with-resources: automatically closes Connection and PreparedStatement
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToUser(rs));
                }
            }
        }
        return Optional.empty();
    }

    /**
     * Finds a user by email address (used during authentication).
     */
    public Optional<User> findByEmail(String email) throws SQLException {
        String sql = "SELECT id, name, email, password_hash, role, avatar_url, created_at FROM users WHERE LOWER(email) = LOWER(?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email.trim());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToUser(rs));
                }
            }
        }
        return Optional.empty();
    }

    /**
     * Inserts a new user record.
     */
    public boolean insert(User user) throws SQLException {
        String sql = "INSERT INTO users (id, name, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getId());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getEmail());
            stmt.setString(4, user.getPasswordHash());
            stmt.setString(5, user.getRole().name());
            stmt.setString(6, user.getAvatarUrl());

            return stmt.executeUpdate() > 0;
        }
    }

    /**
     * Retrieves all student users for class analytics and ranking.
     */
    public List<Student> findAllStudents() throws SQLException {
        String sql = "SELECT id, name, email, password_hash, role, avatar_url, created_at FROM users WHERE role = 'STUDENT' ORDER BY name ASC";
        List<Student> students = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                User u = mapRowToUser(rs);
                if (u instanceof Student s) {
                    students.add(s);
                }
            }
        }
        return students;
    }

    /**
     * Helper mapping a ResultSet row to either a Student or Admin instance polymorphically.
     */
    private User mapRowToUser(ResultSet rs) throws SQLException {
        String roleStr = rs.getString("role");
        UserRole role = UserRole.valueOf(roleStr);

        User user;
        if (role == UserRole.ADMIN) {
            user = new Admin();
        } else {
            user = new Student();
        }

        user.setId(rs.getString("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setRole(role);
        user.setAvatarUrl(rs.getString("avatar_url"));
        user.setCreatedAt(rs.getTimestamp("created_at"));

        return user;
    }
}
