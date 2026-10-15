package com.quiznova.dao;

import com.quiznova.model.Attempt;
import com.quiznova.model.AttemptAnswer;
import com.quiznova.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Concept: JDBC - Database Transactions (Commit & Rollback), Batch Inserts, SQL Joins
 * 
 * Manages atomic persistence of quiz attempts and individual question answers.
 */
public class AttemptDAO {

    /**
     * Saves an attempt and all corresponding answer records inside a single atomic ACID transaction.
     * Demonstrates: setAutoCommit(false), commit(), and rollback() on exception.
     */
    public boolean saveAttemptWithAnswers(Attempt attempt, List<AttemptAnswer> answers) throws SQLException {
        String insertAttemptSql = "INSERT INTO attempts (id, user_id, quiz_id, score, total_questions, " +
                "correct_answers, wrong_answers, skipped_answers, percentage, passed, time_taken_seconds, completed_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String insertAnswerSql = "INSERT INTO attempt_answers (id, attempt_id, question_id, selected_option_index, is_correct) " +
                "VALUES (?, ?, ?, ?, ?)";

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            // 1. Begin atomic transaction
            conn.setAutoCommit(false);

            // 2. Insert master attempt row
            try (PreparedStatement stmtAttempt = conn.prepareStatement(insertAttemptSql)) {
                stmtAttempt.setString(1, attempt.getId());
                stmtAttempt.setString(2, attempt.getUserId());
                stmtAttempt.setString(3, attempt.getQuizId());
                stmtAttempt.setInt(4, attempt.getScore());
                stmtAttempt.setInt(5, attempt.getTotalQuestions());
                stmtAttempt.setInt(6, attempt.getCorrectAnswers());
                stmtAttempt.setInt(7, attempt.getWrongAnswers());
                stmtAttempt.setInt(8, attempt.getSkippedAnswers());
                stmtAttempt.setDouble(9, attempt.getPercentage());
                stmtAttempt.setBoolean(10, attempt.isPassed());
                stmtAttempt.setInt(11, attempt.getTimeTakenSeconds());
                stmtAttempt.setTimestamp(12, attempt.getCompletedAt() != null ? attempt.getCompletedAt() : new Timestamp(System.currentTimeMillis()));
                stmtAttempt.executeUpdate();
            }

            // 3. Batch insert child answers
            if (answers != null && !answers.isEmpty()) {
                try (PreparedStatement stmtAnswer = conn.prepareStatement(insertAnswerSql)) {
                    for (AttemptAnswer ans : answers) {
                        stmtAnswer.setString(1, ans.getId());
                        stmtAnswer.setString(2, attempt.getId());
                        stmtAnswer.setString(3, ans.getQuestionId());
                        if (ans.getSelectedOptionIndex() != null) {
                            stmtAnswer.setInt(4, ans.getSelectedOptionIndex());
                        } else {
                            stmtAnswer.setNull(4, Types.INTEGER);
                        }
                        stmtAnswer.setBoolean(5, ans.isCorrect());
                        stmtAnswer.addBatch();
                    }
                    stmtAnswer.executeBatch();
                }
            }

            // 4. Commit atomic transaction
            conn.commit();
            return true;
        } catch (SQLException e) {
            // Rollback on any failure to preserve database integrity
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("[AttemptDAO] Transaction rollback error: " + ex.getMessage());
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ignored) {
                }
            }
        }
    }

    public List<Attempt> findByUserId(String userId) throws SQLException {
        String sql = "SELECT a.id, a.user_id, a.quiz_id, a.score, a.total_questions, a.correct_answers, " +
                     "a.wrong_answers, a.skipped_answers, a.percentage, a.passed, a.time_taken_seconds, a.completed_at, " +
                     "u.name AS user_name, u.email AS user_email, q.title AS quiz_title, q.category AS quiz_category " +
                     "FROM attempts a " +
                     "JOIN users u ON a.user_id = u.id " +
                     "JOIN quizzes q ON a.quiz_id = q.id " +
                     "WHERE a.user_id = ? " +
                     "ORDER BY a.completed_at DESC";

        List<Attempt> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToAttemptWithMetadata(rs));
                }
            }
        }
        return list;
    }

    public List<Attempt> findAll() throws SQLException {
        String sql = "SELECT a.id, a.user_id, a.quiz_id, a.score, a.total_questions, a.correct_answers, " +
                     "a.wrong_answers, a.skipped_answers, a.percentage, a.passed, a.time_taken_seconds, a.completed_at, " +
                     "u.name AS user_name, u.email AS user_email, q.title AS quiz_title, q.category AS quiz_category " +
                     "FROM attempts a " +
                     "JOIN users u ON a.user_id = u.id " +
                     "JOIN quizzes q ON a.quiz_id = q.id " +
                     "ORDER BY a.completed_at DESC";

        List<Attempt> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                list.add(mapRowToAttemptWithMetadata(rs));
            }
        }
        return list;
    }

    public Optional<Attempt> findById(String id) throws SQLException {
        String sql = "SELECT a.id, a.user_id, a.quiz_id, a.score, a.total_questions, a.correct_answers, " +
                     "a.wrong_answers, a.skipped_answers, a.percentage, a.passed, a.time_taken_seconds, a.completed_at, " +
                     "u.name AS user_name, u.email AS user_email, q.title AS quiz_title, q.category AS quiz_category " +
                     "FROM attempts a " +
                     "JOIN users u ON a.user_id = u.id " +
                     "JOIN quizzes q ON a.quiz_id = q.id " +
                     "WHERE a.id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Attempt attempt = mapRowToAttemptWithMetadata(rs);
                    attempt.setAnswers(findAnswersByAttemptId(conn, attempt.getId()));
                    return Optional.of(attempt);
                }
            }
        }
        return Optional.empty();
    }

    private List<AttemptAnswer> findAnswersByAttemptId(Connection conn, String attemptId) throws SQLException {
        String sql = "SELECT id, attempt_id, question_id, selected_option_index, is_correct " +
                     "FROM attempt_answers WHERE attempt_id = ?";
        List<AttemptAnswer> answers = new ArrayList<>();

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, attemptId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    AttemptAnswer ans = new AttemptAnswer();
                    ans.setId(rs.getString("id"));
                    ans.setAttemptId(rs.getString("attempt_id"));
                    ans.setQuestionId(rs.getString("question_id"));
                    int sel = rs.getInt("selected_option_index");
                    ans.setSelectedOptionIndex(rs.wasNull() ? null : sel);
                    ans.setCorrect(rs.getBoolean("is_correct"));
                    answers.add(ans);
                }
            }
        }
        return answers;
    }

    private Attempt mapRowToAttemptWithMetadata(ResultSet rs) throws SQLException {
        Attempt a = new Attempt();
        a.setId(rs.getString("id"));
        a.setUserId(rs.getString("user_id"));
        a.setQuizId(rs.getString("quiz_id"));
        a.setScore(rs.getInt("score"));
        a.setTotalQuestions(rs.getInt("total_questions"));
        a.setCorrectAnswers(rs.getInt("correct_answers"));
        a.setWrongAnswers(rs.getInt("wrong_answers"));
        a.setSkippedAnswers(rs.getInt("skipped_answers"));
        a.setPercentage(rs.getDouble("percentage"));
        a.setPassed(rs.getBoolean("passed"));
        a.setTimeTakenSeconds(rs.getInt("time_taken_seconds"));
        a.setCompletedAt(rs.getTimestamp("completed_at"));

        a.setUserName(rs.getString("user_name"));
        a.setUserEmail(rs.getString("user_email"));
        a.setQuizTitle(rs.getString("quiz_title"));
        a.setQuizCategory(rs.getString("quiz_category"));
        return a;
    }
}
