package com.quiznova.servlet;

import com.quiznova.dao.QuizDAO;
import com.quiznova.model.Quiz;
import com.quiznova.model.User;
import com.quiznova.model.UserRole;
import com.quiznova.service.QuizService;
import com.quiznova.util.JsonUtil;
import com.quiznova.util.Result;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;

/**
 * Concept: Jakarta Servlets - Role Authorization, doPost(), doPut(), doDelete()
 * 
 * Provides administrator-only endpoints for quiz lifecycle management.
 */
@WebServlet(name = "AdminQuizServlet", urlPatterns = {"/api/admin/quizzes", "/api/admin/quizzes/*"})
public class AdminQuizServlet extends HttpServlet {

    private final QuizService quizService = new QuizService();
    private final QuizDAO quizDAO = new QuizDAO();

    private boolean verifyAdminAccess(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("currentUser") : null;

        if (user == null || user.getRole() != UserRole.ADMIN) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"success\":false,\"error\":\"Forbidden: Instructor Admin role required.\"}");
            return false;
        }
        return true;
    }

    /**
     * POST /api/admin/quizzes -> Create new quiz
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        if (!verifyAdminAccess(request, response)) return;

        Quiz quiz = JsonUtil.fromReader(request.getReader(), Quiz.class);
        if (quiz == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"error\":\"Invalid quiz payload.\"}");
            return;
        }

        Result<Quiz> result = quizService.createQuiz(quiz);
        response.setStatus(result.getStatusCode());
        response.getWriter().write(JsonUtil.toJson(result));
    }

    /**
     * PUT /api/admin/quizzes/{id} -> Update existing quiz
     */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        if (!verifyAdminAccess(request, response)) return;

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"error\":\"Quiz ID path parameter is required for update.\"}");
            return;
        }

        String quizId = pathInfo.substring(1);
        Quiz quiz = JsonUtil.fromReader(request.getReader(), Quiz.class);
        quiz.setId(quizId);

        try {
            boolean ok = quizDAO.update(quiz);
            if (ok) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(JsonUtil.toJson(Result.success(quiz)));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"success\":false,\"error\":\"Quiz not found for update.\"}");
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false,\"error\":\"Database error: " + e.getMessage() + "\"}");
        }
    }

    /**
     * DELETE /api/admin/quizzes/{id} -> Remove quiz and cascaded questions
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        if (!verifyAdminAccess(request, response)) return;

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"error\":\"Quiz ID path parameter required for deletion.\"}");
            return;
        }

        String quizId = pathInfo.substring(1);
        try {
            boolean ok = quizDAO.delete(quizId);
            if (ok) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"success\":true,\"message\":\"Quiz and its questions successfully deleted.\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"success\":false,\"error\":\"Quiz not found for deletion.\"}");
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false,\"error\":\"Database error: " + e.getMessage() + "\"}");
        }
    }
}
