package com.quiznova.servlet;

import com.quiznova.model.Attempt;
import com.quiznova.model.User;
import com.quiznova.service.QuizService;
import com.quiznova.util.JsonUtil;
import com.quiznova.util.Result;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Map;

/**
 * Concept: Jakarta Servlets - doPost(), Multithreading Trigger, JSON Responses
 * 
 * Receives candidate exam submission and coordinates concurrent auto-grading.
 */
@WebServlet(name = "SubmitQuizServlet", urlPatterns = {"/api/quizzes/submit"})
public class SubmitQuizServlet extends HttpServlet {

    private final QuizService quizService = new QuizService();

    private static class SubmissionRequest {
        String quizId;
        Map<String, Integer> answers; // questionId -> chosenOptionIndex
        int timeTakenSeconds;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;
        String userId = (currentUser != null) ? currentUser.getId() : "u_guest_student";

        SubmissionRequest req = JsonUtil.fromReader(request.getReader(), SubmissionRequest.class);
        if (req == null || req.quizId == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"error\":\"Invalid submission payload. Quiz ID required.\"}");
            return;
        }

        // Multithreaded evaluation coordinated by QuizService
        Result<Attempt> result = quizService.submitQuizAnswers(
                userId,
                req.quizId,
                req.answers,
                req.timeTakenSeconds
        );

        response.setStatus(result.getStatusCode());
        response.getWriter().write(JsonUtil.toJson(result));
    }
}
