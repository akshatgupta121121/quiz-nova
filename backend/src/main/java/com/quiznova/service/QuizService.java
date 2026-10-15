package com.quiznova.service;

import com.quiznova.dao.AttemptDAO;
import com.quiznova.dao.QuestionDAO;
import com.quiznova.dao.QuizDAO;
import com.quiznova.dao.UserDAO;
import com.quiznova.exception.InvalidQuizException;
import com.quiznova.exception.QuizNotFoundException;
import com.quiznova.model.*;
import com.quiznova.util.Result;

import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * Concept: Java Collections, Generics, Custom Exceptions & Multithreading Coordination
 * 
 * Central business service orchestrating quiz catalog management, validation,
 * asynchronous grading execution, and leaderboard synchronization.
 */
public class QuizService {

    private final QuizDAO quizDAO = new QuizDAO();
    private final QuestionDAO questionDAO = new QuestionDAO();
    private final AttemptDAO attemptDAO = new AttemptDAO();
    private final UserDAO userDAO = new UserDAO();
    private final GradingExecutionService gradingExecutionService = GradingExecutionService.getInstance();

    /**
     * Retrieves all quizzes with their loaded questions.
     * Demonstrates: Generics Result<List<Quiz>> and Collections (List).
     */
    public Result<List<Quiz>> getAllQuizzes() {
        try {
            List<Quiz> quizzes = quizDAO.findAll();
            for (Quiz q : quizzes) {
                // Populate questions using Collections
                List<Question> questions = questionDAO.findByQuizId(q.getId());
                q.setQuestions(questions);
            }
            return Result.success(quizzes);
        } catch (SQLException e) {
            return Result.failure("Database error loading quizzes: " + e.getMessage(), 500);
        }
    }

    /**
     * Retrieves a single quiz by ID with full question bank.
     * Demonstrates: Custom Exception (QuizNotFoundException).
     */
    public Result<Quiz> getQuizById(String quizId) {
        try {
            Optional<Quiz> opt = quizDAO.findById(quizId);
            if (opt.isEmpty()) {
                throw new QuizNotFoundException(quizId);
            }
            Quiz quiz = opt.get();
            quiz.setQuestions(questionDAO.findByQuizId(quizId));
            return Result.success(quiz);
        } catch (QuizNotFoundException qe) {
            return Result.failure(qe.getMessage(), qe.getStatusCode());
        } catch (SQLException e) {
            return Result.failure("Database error: " + e.getMessage(), 500);
        }
    }

    /**
     * Creates a new quiz with strict business validation.
     * Demonstrates: Custom Exception (InvalidQuizException).
     */
    public Result<Quiz> createQuiz(Quiz quiz) {
        try {
            validateQuiz(quiz);
            if (quiz.getId() == null || quiz.getId().trim().isEmpty()) {
                quiz.setId("quiz_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 4));
            }
            boolean ok = quizDAO.insert(quiz);
            if (!ok) {
                return Result.failure("Failed to insert quiz", 500);
            }
            return Result.success(quiz, 201);
        } catch (InvalidQuizException iqe) {
            return Result.failure(iqe.getMessage(), iqe.getStatusCode());
        } catch (SQLException e) {
            return Result.failure("Database error: " + e.getMessage(), 500);
        }
    }

    /**
     * Submits a candidate's answers and evaluates score asynchronously via Multithreading.
     * Demonstrates:
     * 1. Collections: Map<String, Integer> for questionId -> selectedOption mapping
     * 2. Multithreading: ExecutorService auto-grading worker task via Callable
     * 3. Synchronized leaderboard refresh
     *
     * @param userId Student ID
     * @param quizId Quiz ID
     * @param userAnswers Map of Question ID to chosen option index (0..3)
     * @param timeTakenSeconds Duration taken
     * @return Result<Attempt> containing evaluated attempt
     */
    public Result<Attempt> submitQuizAnswers(String userId, String quizId,
                                            Map<String, Integer> userAnswers,
                                            int timeTakenSeconds) {
        try {
            Optional<Quiz> quizOpt = quizDAO.findById(quizId);
            if (quizOpt.isEmpty()) {
                throw new QuizNotFoundException(quizId);
            }
            Quiz quiz = quizOpt.get();
            List<Question> questions = questionDAO.findByQuizId(quizId);

            if (questions.isEmpty()) {
                return Result.failure("Cannot submit: quiz has no questions", 400);
            }

            // Multithreading: Offload grading arithmetic to background ExecutorService thread pool
            Future<Attempt> gradingFuture = gradingExecutionService.submitGradingTask(() -> {
                int correctCount = 0;
                int wrongCount = 0;
                int skippedCount = 0;
                int totalMarks = 0;

                List<AttemptAnswer> answersList = new ArrayList<>();
                String attemptId = "att_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 4);

                for (Question q : questions) {
                    Integer chosen = userAnswers != null ? userAnswers.get(q.getId()) : null;
                    boolean isCorrect = (chosen != null && chosen == q.getCorrectOptionIndex());

                    if (chosen == null) {
                        skippedCount++;
                    } else if (isCorrect) {
                        correctCount++;
                        totalMarks += q.getMarks();
                    } else {
                        wrongCount++;
                    }

                    answersList.add(new AttemptAnswer(
                            "ans_" + UUID.randomUUID().toString().substring(0, 8),
                            attemptId,
                            q.getId(),
                            chosen,
                            isCorrect
                    ));
                }

                double percentage = ((double) correctCount / questions.size()) * 100.0;
                percentage = Math.round(percentage * 10.0) / 10.0;
                boolean passed = percentage >= quiz.getPassPercentage();

                Attempt attempt = new Attempt(
                        attemptId,
                        userId,
                        quizId,
                        correctCount,
                        questions.size(),
                        correctCount,
                        wrongCount,
                        skippedCount,
                        percentage,
                        passed,
                        timeTakenSeconds
                );
                attempt.setAnswers(answersList);

                // Persist attempt and child answer rows inside a single atomic JDBC transaction
                attemptDAO.saveAttemptWithAnswers(attempt, answersList);

                // Update category submission counter atomically
                gradingExecutionService.incrementCategorySubmission(quiz.getCategory());

                return attempt;
            });

            // Wait for thread pool to finish grading
            Attempt completedAttempt = gradingFuture.get();

            // Refresh leaderboard cache in a synchronized manner
            refreshLeaderboardCache();

            return Result.success(completedAttempt);

        } catch (QuizNotFoundException qe) {
            return Result.failure(qe.getMessage(), qe.getStatusCode());
        } catch (InterruptedException | ExecutionException e) {
            return Result.failure("Grading worker thread error: " + e.getMessage(), 500);
        } catch (Exception e) {
            return Result.failure("Submission evaluation error: " + e.getMessage(), 500);
        }
    }

    /**
     * Refreshes leaderboard rankings using Java Collections & Streams.
     */
    private void refreshLeaderboardCache() {
        try {
            List<Student> students = userDAO.findAllStudents();
            List<Attempt> allAttempts = attemptDAO.findAll();

            // Group attempts by user ID using Map Collection
            Map<String, List<Attempt>> attemptsByUser = new HashMap<>();
            for (Attempt a : allAttempts) {
                attemptsByUser.computeIfAbsent(a.getUserId(), k -> new ArrayList<>()).add(a);
            }

            for (Student s : students) {
                List<Attempt> userAttempts = attemptsByUser.getOrDefault(s.getId(), Collections.emptyList());
                s.setTotalQuizzesTaken(userAttempts.size());

                if (!userAttempts.isEmpty()) {
                    double total = 0;
                    double best = 0;
                    for (Attempt a : userAttempts) {
                        total += a.getPercentage();
                        if (a.getPercentage() > best) best = a.getPercentage();
                    }
                    s.setCumulativeAverage(Math.round((total / userAttempts.size()) * 10.0) / 10.0);
                    s.setPersonalBest(best);
                }
            }

            // Multithreading: Safely update synchronized shared leaderboard
            gradingExecutionService.updateLeaderboardSynchronized(students);

        } catch (SQLException e) {
            System.err.println("[QuizService] Leaderboard cache refresh warning: " + e.getMessage());
        }
    }

    /**
     * Validation method demonstrating Custom Exception
     */
    private void validateQuiz(Quiz quiz) {
        if (quiz.getTitle() == null || quiz.getTitle().trim().isEmpty()) {
            throw new InvalidQuizException("Quiz title cannot be null or empty.");
        }
        if (quiz.getDescription() == null || quiz.getDescription().trim().isEmpty()) {
            throw new InvalidQuizException("Quiz description cannot be null or empty.");
        }
        if (quiz.getDurationMinutes() <= 0 || quiz.getDurationMinutes() > 300) {
            throw new InvalidQuizException("Quiz duration must be between 1 and 300 minutes.");
        }
        if (quiz.getPassPercentage() < 10.0 || quiz.getPassPercentage() > 100.0) {
            throw new InvalidQuizException("Pass percentage must be between 10.0% and 100.0%.");
        }
    }
}
