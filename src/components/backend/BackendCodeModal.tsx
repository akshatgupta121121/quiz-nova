import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Database, Server, Cpu, Layers, Terminal } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface BackendCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BackendFile {
  name: string;
  category: 'Schema & Build' | 'OOP Models' | 'JDBC DAOs' | 'Service & Multithreading' | 'Jakarta Servlets';
  concept: string;
  path: string;
  content: string;
}

const BACKEND_FILES: BackendFile[] = [
  {
    name: 'schema.sql',
    category: 'Schema & Build',
    concept: 'Relational Schema DDL & ACID Foreign Keys',
    path: 'backend/src/main/resources/schema.sql',
    content: `-- ====================================================================
-- QuizNova: Database Schema & Seed Data (MySQL 8.0+)
-- Concept Demonstrated: Relational Schema Design, Foreign Keys, Indexes
-- ====================================================================

DROP DATABASE IF EXISTS quiznova_db;
CREATE DATABASE quiznova_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiznova_db;

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

CREATE TABLE quizzes (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'INTERMEDIATE',
    duration_minutes INT NOT NULL DEFAULT 15,
    pass_percentage DOUBLE NOT NULL DEFAULT 70.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE questions (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) NOT NULL,
    question_text TEXT NOT NULL,
    code_snippet TEXT,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option_index INT NOT NULL CHECK (correct_option_index BETWEEN 0 AND 3),
    explanation TEXT NOT NULL,
    marks INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    quiz_id VARCHAR(64) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    wrong_answers INT NOT NULL DEFAULT 0,
    skipped_answers INT NOT NULL DEFAULT 0,
    percentage DOUBLE NOT NULL DEFAULT 0.0,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    time_taken_seconds INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE attempt_answers (
    id VARCHAR(64) PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(64) NOT NULL,
    selected_option_index INT NULL CHECK (selected_option_index BETWEEN 0 AND 3),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_answers_attempt FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;`,
  },
  {
    name: 'Gradable.java',
    category: 'OOP Models',
    concept: 'OOP: Interface Contract & Polymorphism',
    path: 'backend/src/main/java/com/quiznova/model/Gradable.java',
    content: `package com.quiznova.model;

/**
 * Concept: OOP - Interface & Polymorphism
 * 
 * Defines the contract for any entity that can be evaluated, graded,
 * and ranked within the QuizNova performance engine.
 */
public interface Gradable {

    /**
     * Calculates the letter grade (A, B, C, D, F) based on performance percentage.
     * Demonstrates: Interface method contract & Polymorphism.
     */
    String calculateGrade(double percentage);

    /**
     * Determines whether the entity has satisfied the passing benchmark.
     */
    default boolean isPassing(double score, double passScore) {
        return score >= passScore;
    }
}`,
  },
  {
    name: 'Student.java',
    category: 'OOP Models',
    concept: 'OOP: Inheritance, Specialization & Polymorphic Implementation',
    path: 'backend/src/main/java/com/quiznova/model/Student.java',
    content: `package com.quiznova.model;

/**
 * Concept: OOP - Inheritance, Polymorphism & Interface Implementation
 * 
 * Student extends User (Inheritance) and implements Gradable (Polymorphism).
 */
public class Student extends User implements Gradable {

    private int totalQuizzesTaken;
    private double cumulativeAverage;
    private double personalBest;
    private int classRank;

    public Student() {
        super();
        setRole(UserRole.STUDENT);
    }

    public Student(String id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash, UserRole.STUDENT);
    }

    // Polymorphic method implementation from Person
    @Override
    public String getRoleTitle() {
        return "Certified Java Student Candidate";
    }

    // Polymorphic method implementation from Gradable interface
    @Override
    public String calculateGrade(double percentage) {
        if (percentage >= 90.0) return "A+ (Mastery)";
        if (percentage >= 80.0) return "A (Proficient)";
        if (percentage >= 70.0) return "B (Passing)";
        if (percentage >= 60.0) return "C (Needs Review)";
        return "F (Retake Required)";
    }

    // Getters and Setters ...
}`,
  },
  {
    name: 'AttemptDAO.java',
    category: 'JDBC DAOs',
    concept: 'JDBC: Multi-Table ACID Transactions & Batch Execution',
    path: 'backend/src/main/java/com/quiznova/dao/AttemptDAO.java',
    content: `package com.quiznova.dao;

import com.quiznova.model.Attempt;
import com.quiznova.model.AttemptAnswer;
import com.quiznova.util.DBConnection;
import java.sql.*;
import java.util.List;

/**
 * Concept: JDBC - Database Transactions (Commit & Rollback), Batch Inserts
 */
public class AttemptDAO {

    public boolean saveAttemptWithAnswers(Attempt attempt, List<AttemptAnswer> answers) throws SQLException {
        String insertAttemptSql = "INSERT INTO attempts (...) VALUES (?, ?, ...)";
        String insertAnswerSql = "INSERT INTO attempt_answers (...) VALUES (?, ?, ...)";

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            // 1. Begin atomic transaction
            conn.setAutoCommit(false);

            // 2. Insert master attempt row
            try (PreparedStatement stmtAttempt = conn.prepareStatement(insertAttemptSql)) {
                // bind parameters...
                stmtAttempt.executeUpdate();
            }

            // 3. Batch insert child answers
            if (answers != null && !answers.isEmpty()) {
                try (PreparedStatement stmtAnswer = conn.prepareStatement(insertAnswerSql)) {
                    for (AttemptAnswer ans : answers) {
                        // bind and addBatch
                        stmtAnswer.addBatch();
                    }
                    stmtAnswer.executeBatch();
                }
            }

            // 4. Commit atomic transaction
            conn.commit();
            return true;
        } catch (SQLException e) {
            // Rollback on any failure to preserve integrity
            if (conn != null) conn.rollback();
            throw e;
        } finally {
            if (conn != null) {
                conn.setAutoCommit(true);
                conn.close();
            }
        }
    }
}`,
  },
  {
    name: 'GradingExecutionService.java',
    category: 'Service & Multithreading',
    concept: 'Multithreading: ExecutorService & Synchronized Leaderboard Cache',
    path: 'backend/src/main/java/com/quiznova/service/GradingExecutionService.java',
    content: `package com.quiznova.service;

import com.quiznova.model.Attempt;
import com.quiznova.model.Student;
import java.util.*;
import java.util.concurrent.*;

/**
 * Concept: Java Multithreading & Concurrency
 * 
 * 1. ExecutorService fixed thread pool for auto-grading submissions concurrently
 * 2. Asynchronous task execution using Callable and Future
 * 3. Synchronized blocks protecting shared in-memory leaderboard ranking cache
 * 4. Thread-safe ConcurrentHashMap for volatile runtime counters
 */
public class GradingExecutionService {

    private final ExecutorService gradingThreadPool;
    private final Object leaderboardLock = new Object();
    private List<Student> cachedLeaderboard = new ArrayList<>();
    private final ConcurrentHashMap<String, Long> categorySubmissionCounters = new ConcurrentHashMap<>();

    private GradingExecutionService() {
        int cores = Runtime.getRuntime().availableProcessors();
        this.gradingThreadPool = Executors.newFixedThreadPool(Math.max(4, cores * 2));
    }

    public Future<Attempt> submitGradingTask(Callable<Attempt> task) {
        return gradingThreadPool.submit(task);
    }

    public void updateLeaderboardSynchronized(List<Student> freshStudents) {
        synchronized (leaderboardLock) {
            this.cachedLeaderboard = new ArrayList<>(freshStudents);
            this.cachedLeaderboard.sort(Comparator
                    .comparingDouble(Student::getCumulativeAverage).reversed()
                    .thenComparingInt(Student::getTotalQuizzesTaken).reversed());
            for (int i = 0; i < this.cachedLeaderboard.size(); i++) {
                this.cachedLeaderboard.get(i).setClassRank(i + 1);
            }
        }
    }

    public List<Student> getCachedLeaderboardSynchronized() {
        synchronized (leaderboardLock) {
            return Collections.unmodifiableList(new ArrayList<>(this.cachedLeaderboard));
        }
    }
}`,
  },
  {
    name: 'SubmitQuizServlet.java',
    category: 'Jakarta Servlets',
    concept: 'Jakarta Servlets: doPost(), JSON API & Multithreading Coordination',
    path: 'backend/src/main/java/com/quiznova/servlet/SubmitQuizServlet.java',
    content: `package com.quiznova.servlet;

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

@WebServlet(name = "SubmitQuizServlet", urlPatterns = {"/api/quizzes/submit"})
public class SubmitQuizServlet extends HttpServlet {

    private final QuizService quizService = new QuizService();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;
        String userId = (currentUser != null) ? currentUser.getId() : "u_guest_student";

        SubmissionRequest req = JsonUtil.fromReader(request.getReader(), SubmissionRequest.class);

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
}`,
  },
  {
    name: 'AuthFilter.java',
    category: 'Jakarta Servlets',
    concept: 'Jakarta Filter: Filter Pipeline, CORS & HttpSession Auth Enforcement',
    path: 'backend/src/main/java/com/quiznova/filter/AuthFilter.java',
    content: `package com.quiznova.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(filterName = "AuthFilter", urlPatterns = {"/api/*"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        httpResponse.setContentType("application/json;charset=UTF-8");
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = httpRequest.getRequestURI();
        if (path.contains("/api/auth/") || (path.contains("/api/quizzes") && "GET".equalsIgnoreCase(httpRequest.getMethod()))) {
            chain.doFilter(request, response);
            return;
        }

        HttpSession session = httpRequest.getSession(false);
        boolean loggedIn = (session != null && session.getAttribute("currentUser") != null);

        if (!loggedIn) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"success\":false,\"error\":\"Authentication required.\"}");
            return;
        }

        chain.doFilter(request, response);
    }
}`,
  },
];

export const BackendCodeModal: React.FC<BackendCodeModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<BackendFile>(BACKEND_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    showToast(`Copied ${selectedFile.name} to clipboard.`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSQL = () => {
    const schemaFile = BACKEND_FILES.find((f) => f.name === 'schema.sql');
    if (!schemaFile) return;

    const blob = new Blob([schemaFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('schema.sql downloaded successfully.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl h-[88vh] rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-lime-400 font-bold font-display text-sm">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Java 17 / Jakarta EE Backend Architecture</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-lime-400/10 text-lime-600 dark:text-lime-400 font-semibold">
                  Tomcat 10 &amp; MySQL
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Explore the complete generated Maven project source code and concept mapping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSQL}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download schema.sql</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar list + Code preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Files List */}
          <div className="w-full md:w-72 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 p-3 overflow-y-auto shrink-0 space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono-code">
              Backend Source Files
            </div>

            {BACKEND_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col ${
                    isSelected
                      ? 'bg-neutral-900 text-lime-400 dark:bg-neutral-800 shadow-sm border border-neutral-700'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="font-mono-code">{file.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">{file.category}</span>
                  </div>
                  <span className="text-[11px] opacity-80 truncate mt-0.5">
                    {file.concept}
                  </span>
                </button>
              );
            })}

            <div className="pt-3 px-2 text-[11px] text-neutral-500 border-t border-neutral-200 dark:border-neutral-800/80">
              <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Project Path on Server:
              </p>
              <code className="text-[10px] font-mono-code text-indigo-400 block bg-neutral-900/50 p-1.5 rounded">
                /backend/pom.xml
              </code>
            </div>
          </div>

          {/* Right: Code Viewer */}
          <div className="flex-1 flex flex-col bg-neutral-900 text-neutral-100 overflow-hidden">
            {/* Sub-header */}
            <div className="px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-lime-400" />
                <span className="font-mono-code text-neutral-200">{selectedFile.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-lime-400 font-medium hidden sm:inline">
                  {selectedFile.concept}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 text-[11px] font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-lime-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Code container */}
            <div className="flex-1 p-4 overflow-auto font-mono-code text-xs leading-relaxed text-neutral-200 selection:bg-lime-400 selection:text-neutral-950">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Run Backend:</span>
            <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded font-mono-code text-[11px]">
              cd backend &amp;&amp; mvn clean package
            </code>
          </div>
          <span>Deploys as quiznova.war to Apache Tomcat 10+</span>
        </div>
      </div>
    </div>
  );
};
