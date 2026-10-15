package com.quiznova.servlet;

import com.quiznova.model.User;
import com.quiznova.service.AuthService;
import com.quiznova.util.JsonUtil;
import com.quiznova.util.Result;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Concept: Jakarta Servlets - HttpServlet, doPost(), Session Management (HttpSession)
 * 
 * Verifies credentials and stores authenticated user in server-side session.
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/api/auth/login"})
public class LoginServlet extends HttpServlet {

    private final AuthService authService = new AuthService();

    private static class LoginRequest {
        String email;
        String password;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        LoginRequest req = JsonUtil.fromReader(request.getReader(), LoginRequest.class);
        if (req == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"error\":\"Invalid login request body.\"}");
            return;
        }

        Result<User> result = authService.login(req.email, req.password);
        response.setStatus(result.getStatusCode());

        if (result.isSuccess()) {
            // Concept: Session Tracking with JSESSIONID
            HttpSession session = request.getSession(true);
            session.setAttribute("currentUser", result.getData());
        }

        response.getWriter().write(JsonUtil.toJson(result));
    }
}
