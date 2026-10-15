package com.quiznova.dao;

import com.quiznova.model.Question;
import com.quiznova.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Concept: JDBC - PreparedStatements, ResultSet Processing
 * 
 * Manages SQL persistence for the 'questions' table.
 */
public class QuestionDAO {

    public List<Question> findByQuizId(String quizId) throws SQLException {
        String sql = "SELECT id, quiz_id, question_text, code_snippet, option_a, option_b, option_c, option_d, " +
                     "correct_option_index, explanation, marks FROM questions WHERE quiz_id = ? ORDER BY id ASC";
        List<Question> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, quizId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToQuestion(rs));
                }
            }
        }
        return list;
    }

    public Optional<Question> findById(String id) throws SQLException {
        String sql = "SELECT id, quiz_id, question_text, code_snippet, option_a, option_b, option_c, option_d, " +
                     "correct_option_index, explanation, marks FROM questions WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToQuestion(rs));
                }
            }
        }
        return Optional.empty();
    }

    public boolean insert(Question q) throws SQLException {
        String sql = "INSERT INTO questions (id, quiz_id, question_text, code_snippet, option_a, option_b, option_c, option_d, " +
                     "correct_option_index, explanation, marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, q.getId());
            stmt.setString(2, q.getQuizId());
            stmt.setString(3, q.getQuestionText());
            stmt.setString(4, q.getCodeSnippet());
            stmt.setString(5, q.getOptionA());
            stmt.setString(6, q.getOptionB());
            stmt.setString(7, q.getOptionC());
            stmt.setString(8, q.getOptionD());
            stmt.setInt(9, q.getCorrectOptionIndex());
            stmt.setString(10, q.getExplanation());
            stmt.setInt(11, q.getMarks());

            return stmt.executeUpdate() > 0;
        }
    }

    public boolean update(Question q) throws SQLException {
        String sql = "UPDATE questions SET question_text = ?, code_snippet = ?, option_a = ?, option_b = ?, " +
                     "option_c = ?, option_d = ?, correct_option_index = ?, explanation = ?, marks = ? WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, q.getQuestionText());
            stmt.setString(2, q.getCodeSnippet());
            stmt.setString(3, q.getOptionA());
            stmt.setString(4, q.getOptionB());
            stmt.setString(5, q.getOptionC());
            stmt.setString(6, q.getOptionD());
            stmt.setInt(7, q.getCorrectOptionIndex());
            stmt.setString(8, q.getExplanation());
            stmt.setInt(9, q.getMarks());
            stmt.setString(10, q.getId());

            return stmt.executeUpdate() > 0;
        }
    }

    public boolean delete(String id) throws SQLException {
        String sql = "DELETE FROM questions WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    private Question mapRowToQuestion(ResultSet rs) throws SQLException {
        Question q = new Question();
        q.setId(rs.getString("id"));
        q.setQuizId(rs.getString("quiz_id"));
        q.setQuestionText(rs.getString("question_text"));
        q.setCodeSnippet(rs.getString("code_snippet"));
        q.setOptionA(rs.getString("option_a"));
        q.setOptionB(rs.getString("option_b"));
        q.setOptionC(rs.getString("option_c"));
        q.setOptionD(rs.getString("option_d"));
        q.setCorrectOptionIndex(rs.getInt("correct_option_index"));
        q.setExplanation(rs.getString("explanation"));
        q.setMarks(rs.getInt("marks"));
        return q;
    }
}
