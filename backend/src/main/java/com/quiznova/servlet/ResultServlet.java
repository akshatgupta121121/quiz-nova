package com.quiznova.servlet;

import com.quiznova.dao.AttemptDAO;
import com.quiznova.model.Attempt;
import com.quiznova.model.Student;
import com.quiznova.model.User;
import com.quiznova.model.UserRole;
import com.quiznova.service.GradingExecutionService;
import com.quiznova.util.JsonUtil;
import com.quiznova.util.Result;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Concept: Jakarta Servlets - Query Dispatching, Synchronized Cache Access, Role-based Visibility
 * 
 * Serves candidate history, full answer reviews, and thread-safe class rankings.
 */
@WebServlet(name = "ResultServlet", urlPatterns = {"/api/results", "/api/results/*"})
public class ResultServlet extends HttpServlet {

    private final AttemptDAO attemptDAO = new AttemptDAO();
    private final GradingExecutionService gradingService = GradingExecutionService.getInstance();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        String pathInfo = request.getPathInfo();
        HttpSession session = request.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;

        try {
            // Case 1: GET /api/results/leaderboard -> Synchronized class ranking cache
            if ("/leaderboard".equalsIgnoreCase(pathInfo)) {
                List<Student> leaderboard = gradingService.getCachedLeaderboardSynchronized();
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(JsonUtil.toJson(Result.success(leaderboard)));
                return;
            }

            // Case 2: GET /api/results/{attemptId} -> Detailed question review
            if (pathInfo != null && pathInfo.length() > 1 && !"/".equals(pathInfo)) {
                String attemptId = pathInfo.substring(1);
                Optional<Attempt> opt = attemptDAO.findById(attemptId);
                if (opt.isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write("{\"success\":false,\"error\":\"Attempt record not found.\"}");
                    return;
                }
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(JsonUtil.toJson(Result.success(opt.get())));
                return;
            }

            // Case 3: GET /api/results -> List attempts
            // If admin, return all cohort attempts. If student, return their own history.
            List<Attempt> list;
            if (currentUser != null && currentUser.getRole() == UserRole.ADMIN) {
                list = attemptDAO.findAll();
            } else if (currentUser != null) {
                list = attemptDAO.findByUserId(currentUser.getId());
            } else {
                list = attemptDAO.findAll();
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.toJson(Result.success(list)));

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false,\"error\":\"Database error loading results: " + e.getMessage() + "\"}");
        }
    }
}
