package com.quiznova.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Concept: Jakarta EE - Filter Pipeline & Session Tracking
 * 
 * Intercepts incoming requests to configure CORS headers, character encodings,
 * and enforce authentication on protected endpoints.
 */
@WebFilter(filterName = "AuthFilter", urlPatterns = {"/api/*"})
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Lifecycle init() invoked once on container startup
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Set standard JSON content type & UTF-8 encoding
        httpRequest.setCharacterEncoding("UTF-8");
        httpResponse.setCharacterEncoding("UTF-8");
        httpResponse.setContentType("application/json;charset=UTF-8");

        // Set CORS headers for SPA development
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Handle pre-flight OPTIONS request
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = httpRequest.getRequestURI();

        // Allow public authentication endpoints without session check
        if (path.contains("/api/auth/") || (path.contains("/api/quizzes") && "GET".equalsIgnoreCase(httpRequest.getMethod()))) {
            chain.doFilter(request, response);
            return;
        }

        // Check active HttpSession
        HttpSession session = httpRequest.getSession(false);
        boolean loggedIn = (session != null && session.getAttribute("currentUser") != null);

        if (!loggedIn) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"success\":false,\"error\":\"Authentication required. Please sign in.\"}");
            return;
        }

        // Pass control down the filter chain
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Lifecycle destroy() invoked on container shutdown
    }
}
