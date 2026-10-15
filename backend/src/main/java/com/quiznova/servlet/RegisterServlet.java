package com.quiznova.servlet;

import com.quiznova.model.User;
import com.quiznova.model.UserRole;
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
 * Concept: Jakarta Servlets - HttpServlet, doPost(), JSON Responses & HttpSession
 * 
 * Handles user account creation and establishes authenticated session.
 */
@WebServlet(name = "RegisterServlet", urlPatterns = {"/api/auth/register"})
public class RegisterServlet extends HttpServlet {

    private final AuthService authService = new AuthService();

    // DTO for incoming registration JSON
    private static class RegisterRequest {
        String name;
        String email;
        String password;
        String role;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        RegisterRequest req = JsonUtil.fromReader(request.getReader(), RegisterRequest.class);
        if (req == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"error\":\"Invalid request body.\"}");
            return;
        }

        UserRole role = UserRole.STUDENT;
        if ("ADMIN".equalsIgnoreCase(req.role)) {
            role = UserRole.ADMIN;
        }

        Result<User> result = authService.register(req.name, req.email, req.password, role);
        response.setStatus(result.getStatusCode());

        if (result.isSuccess()) {
            // Establish HttpSession
            HttpSession session = request.getSession(true);
            session.setAttribute("currentUser", result.getData());
        }

        response.getWriter().write(JsonUtil.toJson(result));
    }
}
