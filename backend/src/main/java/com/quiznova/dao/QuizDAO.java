package com.quiznova.dao;

import com.quiznova.model.Quiz;
import com.quiznova.model.QuizDifficulty;
import com.quiznova.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Concept: JDBC - PreparedStatements, SQL Injection Defense, Try-With-Resources
 * 
 * Manages database CRUD for 'quizzes' records.
 */
public class QuizDAO {

    public List<Quiz> findAll() throws SQLException {
        String sql = "SELECT id, title, description, category, difficulty, duration_minutes, pass_percentage, created_at, updated_at " +
                     "FROM quizzes ORDER BY created_at DESC";
        List<Quiz> quizzes = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                quizzes.add(mapRowToQuiz(rs));
            }
        }
        return quizzes;
    }

    public Optional<Quiz> findById(String id) throws SQLException {
        String sql = "SELECT id, title, description, category, difficulty, duration_minutes, pass_percentage, created_at, updated_at " +
                     "FROM quizzes WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToQuiz(rs));
                }
            }
        }
        return Optional.empty();
    }

    public boolean insert(Quiz quiz) throws SQLException {
        String sql = "INSERT INTO quizzes (id, title, description, category, difficulty, duration_minutes, pass_percentage) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, quiz.getId());
            stmt.setString(2, quiz.getTitle());
            stmt.setString(3, quiz.getDescription());
            stmt.setString(4, quiz.getCategory());
            stmt.setString(5, quiz.getDifficulty().name());
            stmt.setInt(6, quiz.getDurationMinutes());
            stmt.setDouble(7, quiz.getPassPercentage());

            return stmt.executeUpdate() > 0;
        }
    }

    public boolean update(Quiz quiz) throws SQLException {
        String sql = "UPDATE quizzes SET title = ?, description = ?, category = ?, difficulty = ?, " +
                     "duration_minutes = ?, pass_percentage = ? WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, quiz.getTitle());
            stmt.setString(2, quiz.getDescription());
            stmt.setString(3, quiz.getCategory());
            stmt.setString(4, quiz.getDifficulty().name());
            stmt.setInt(5, quiz.getDurationMinutes());
            stmt.setDouble(6, quiz.getPassPercentage());
            stmt.setString(7, quiz.getId());

            return stmt.executeUpdate() > 0;
        }
    }

    public boolean delete(String id) throws SQLException {
        String sql = "DELETE FROM quizzes WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    private Quiz mapRowToQuiz(ResultSet rs) throws SQLException {
        Quiz quiz = new Quiz();
        quiz.setId(rs.getString("id"));
        quiz.setTitle(rs.getString("title"));
        quiz.setDescription(rs.getString("description"));
        quiz.setCategory(rs.getString("category"));
        quiz.setDifficulty(QuizDifficulty.valueOf(rs.getString("difficulty")));
        quiz.setDurationMinutes(rs.getInt("duration_minutes"));
        quiz.setPassPercentage(rs.getDouble("pass_percentage"));
        quiz.setCreatedAt(rs.getTimestamp("created_at"));
        quiz.setUpdatedAt(rs.getTimestamp("updated_at"));
        return quiz;
    }
}
