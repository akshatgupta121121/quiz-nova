-- ====================================================================
-- QuizNova: Database Schema & Seed Data (MySQL 8.0+)
-- Concept Demonstrated: Relational Schema Design, Foreign Keys, Indexes
-- ====================================================================

DROP DATABASE IF EXISTS quiznova_db;
CREATE DATABASE quiznova_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiznova_db;

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- Maps to Model: User.java, Student.java, Admin.java
-- --------------------------------------------------------------------
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

-- --------------------------------------------------------------------
-- 2. QUIZZES TABLE
-- Maps to Model: Quiz.java
-- --------------------------------------------------------------------
CREATE TABLE quizzes (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'INTERMEDIATE',
    duration_minutes INT NOT NULL DEFAULT 15,
    pass_percentage DOUBLE NOT NULL DEFAULT 70.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_quiz_category (category),
    INDEX idx_quiz_difficulty (difficulty)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 3. QUESTIONS TABLE
-- Maps to Model: Question.java
-- --------------------------------------------------------------------
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
    CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_questions_quiz_id (quiz_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 4. ATTEMPTS TABLE
-- Maps to Model: Attempt.java
-- --------------------------------------------------------------------
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
    CONSTRAINT fk_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_attempts_user (user_id),
    INDEX idx_attempts_quiz (quiz_id),
    INDEX idx_attempts_completed (completed_at)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 5. ATTEMPT_ANSWERS TABLE (Normalized Question-Level Responses)
-- Maps to Model: AttemptAnswer.java
-- --------------------------------------------------------------------
CREATE TABLE attempt_answers (
    id VARCHAR(64) PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(64) NOT NULL,
    selected_option_index INT NULL CHECK (selected_option_index BETWEEN 0 AND 3),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_answers_attempt FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_answers_attempt (attempt_id),
    INDEX idx_answers_question (question_id)
) ENGINE=InnoDB;

-- ====================================================================
-- SEED SAMPLE DATA
-- ====================================================================

-- Seed Users (Passwords are plain or hashed representations; e.g. admin123, student123)
INSERT INTO users (id, name, email, password_hash, role) VALUES
('u_admin_01', 'Instructor Admin', 'admin@quiznova.com', 'admin123', 'ADMIN'),
('u_student_01', 'Alex Mercer', 'alex@example.com', 'student123', 'STUDENT'),
('u_student_02', 'Priya Sharma', 'priya@example.com', 'student123', 'STUDENT'),
('u_student_03', 'Jordan Vance', 'jordan@example.com', 'student123', 'STUDENT'),
('u_student_04', 'Sarah Chen', 'sarah@example.com', 'student123', 'STUDENT'),
('u_student_05', 'David Kim', 'david@example.com', 'student123', 'STUDENT');

-- Seed Quizzes
INSERT INTO quizzes (id, title, description, category, difficulty, duration_minutes, pass_percentage) VALUES
('quiz_core_java', 'Core Java Fundamentals & JVM Memory', 'Master primitive types, memory areas (Heap vs Stack), Garbage Collection, immutability, and JVM execution internals.', 'Core Java', 'BEGINNER', 12, 70.0),
('quiz_oop_java', 'Object-Oriented Programming in Java', 'Deep dive into Polymorphism, Inheritance, Encapsulation, Abstract classes vs Interfaces, and modern Record classes.', 'OOP Concepts', 'INTERMEDIATE', 15, 75.0),
('quiz_collections', 'Java Collections Framework & Generics', 'Test your understanding of List, Set, Map structures, hashing collisions, TreeSet ordering, and thread-safe collections.', 'Collections Framework', 'INTERMEDIATE', 15, 75.0),
('quiz_jdbc', 'JDBC & Database Persistence', 'Relational data access with JDBC: DriverManager, Connection pooling, PreparedStatement, SQL injection defense, and transactions.', 'JDBC', 'ADVANCED', 12, 70.0),
('quiz_servlets', 'Java Servlets & Enterprise Web Architecture', 'HTTP request handling, Servlet lifecycle methods, Session management, Filters, and Dispatcher mechanics in Jakarta EE.', 'Servlets & JSP', 'ADVANCED', 15, 70.0);

-- Seed Core Java Questions
INSERT INTO questions (id, quiz_id, question_text, code_snippet, option_a, option_b, option_c, option_d, correct_option_index, explanation, marks) VALUES
('q_cj_1', 'quiz_core_java', 'Where are local primitive variables and object references stored in the JVM memory architecture?', NULL, 'In the Metaspace', 'In the Heap memory', 'In the JVM Stack frame for the calling thread', 'In the Constant Pool', 2, 'Local variables and references inside a method execution are allocated within the thread-specific JVM Stack frame.', 1),
('q_cj_2', 'quiz_core_java', 'What is the output of the following Java snippet regarding String immutability and the String Constant Pool?', 'String s1 = "QuizNova";\nString s2 = new String("QuizNova");\nSystem.out.println((s1 == s2) + " " + s1.equals(s2));', 'true true', 'false true', 'true false', 'false false', 1, '== compares memory references (false because new String creates Heap object). equals() checks character sequence (true).', 1),
('q_cj_3', 'quiz_core_java', 'What happens when a static method attempts to directly invoke an instance method of the same class without an instantiated object?', NULL, 'It compiles cleanly and runs using default constructor', 'Compile-time error: non-static method cannot be referenced from static context', 'Throws NullPointerException at runtime', 'JVM automatically promotes instance method to static', 1, 'Static methods have no this pointer and belong to the class rather than an instance.', 1),
('q_cj_4', 'quiz_core_java', 'Which primitive data type in Java has a size of exactly 16 bits and is signed (two\'s complement)?', NULL, 'char', 'short', 'byte', 'int', 1, 'short is 16-bit signed integer (-32,768 to 32,767). char is 16-bit unsigned (0 to 65,535).', 1);

-- Seed Sample Attempt
INSERT INTO attempts (id, user_id, quiz_id, score, total_questions, correct_answers, wrong_answers, skipped_answers, percentage, passed, time_taken_seconds, completed_at) VALUES
('att_01', 'u_student_02', 'quiz_core_java', 4, 4, 4, 0, 0, 100.0, TRUE, 230, '2026-03-01 10:30:00'),
('att_02', 'u_student_01', 'quiz_core_java', 3, 4, 3, 1, 0, 75.0, TRUE, 280, '2026-03-02 11:15:00');

-- Seed Sample Answers
INSERT INTO attempt_answers (id, attempt_id, question_id, selected_option_index, is_correct) VALUES
('ans_01', 'att_01', 'q_cj_1', 2, TRUE),
('ans_02', 'att_01', 'q_cj_2', 1, TRUE),
('ans_03', 'att_01', 'q_cj_3', 1, TRUE),
('ans_04', 'att_01', 'q_cj_4', 1, TRUE);
