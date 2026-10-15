package com.quiznova.servlet;

import com.quiznova.model.Quiz;
import com.quiznova.service.QuizService;
import com.quiznova.util.JsonUtil;
import com.quiznova.util.Result;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

/**
 * Concept: Jakarta Servlets - doGet(), Path Parameter Routing, JSON Output
 * 
 * Serves quiz catalog listings or individual quiz details with loaded question bank.
 */
@WebServlet(name = "QuizListServlet", urlPatterns = {"/api/quizzes", "/api/quizzes/*"})
public class QuizListServlet extends HttpServlet {

    private final QuizService quizService = new QuizService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            // GET /api/quizzes -> List all quizzes
            Result<List<Quiz>> result = quizService.getAllQuizzes();
            response.setStatus(result.getStatusCode());
            response.getWriter().write(JsonUtil.toJson(result));
        } else {
            // GET /api/quizzes/{id} -> Single quiz with questions
            String quizId = pathInfo.substring(1);
            Result<Quiz> result = quizService.getQuizById(quizId);
            response.setStatus(result.getStatusCode());
            response.getWriter().write(JsonUtil.toJson(result));
        }
    }
}
