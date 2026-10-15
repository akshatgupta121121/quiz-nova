package com.quiznova.service;

import com.quiznova.model.Attempt;
import com.quiznova.model.Student;

import java.util.*;
import java.util.concurrent.*;

/**
 * Concept: Java Multithreading & Concurrency
 * 
 * Demonstrates:
 * 1. ExecutorService with a fixed thread pool for auto-grading submissions concurrently
 * 2. Asynchronous task execution using Callable and Future
 * 3. Synchronized blocks protecting shared in-memory leaderboard ranking cache
 * 4. Thread-safe ConcurrentHashMap for volatile runtime counters
 */
public class GradingExecutionService {

    // Thread pool dedicated to background grading and audit tasks
    private final ExecutorService gradingThreadPool;

    // Concurrency: Lock object for thread-safe synchronization of shared leaderboard cache
    private final Object leaderboardLock = new Object();
    private List<Student> cachedLeaderboard = new ArrayList<>();
    private long lastLeaderboardUpdateTime = 0;

    // Concurrency: Thread-safe map for real-time submission metrics
    private final ConcurrentHashMap<String, Long> categorySubmissionCounters = new ConcurrentHashMap<>();

    // Singleton instance
    private static volatile GradingExecutionService instance;

    private GradingExecutionService() {
        // Pool size based on available CPU cores
        int cores = Runtime.getRuntime().availableProcessors();
        this.gradingThreadPool = Executors.newFixedThreadPool(
                Math.max(4, cores * 2),
                new ThreadFactory() {
                    private int counter = 1;
                    @Override
                    public Thread newThread(Runnable r) {
                        Thread t = new Thread(r, "QuizNova-GradingWorker-" + (counter++));
                        t.setDaemon(true);
                        return t;
                    }
                }
        );
    }

    public static GradingExecutionService getInstance() {
        if (instance == null) {
            synchronized (GradingExecutionService.class) {
                if (instance == null) {
                    instance = new GradingExecutionService();
                }
            }
        }
        return instance;
    }

    /**
     * Multithreading: Submits a grading task asynchronously.
     *
     * @param task Callable task computing the graded attempt
     * @return Future containing the completed Attempt
     */
    public Future<Attempt> submitGradingTask(Callable<Attempt> task) {
        return gradingThreadPool.submit(task);
    }

    /**
     * Multithreading: Thread-safe update of cached leaderboard.
     * Demonstrates: Synchronized block for critical section protection.
     */
    public void updateLeaderboardSynchronized(List<Student> freshStudents) {
        synchronized (leaderboardLock) {
            // Critical Section: Only one thread can modify the cached standings at a time
            this.cachedLeaderboard = new ArrayList<>(freshStudents);

            // Collections: Sort descending by average score, then quizzes taken
            this.cachedLeaderboard.sort(Comparator
                    .comparingDouble(Student::getCumulativeAverage).reversed()
                    .thenComparingInt(Student::getTotalQuizzesTaken).reversed());

            // Assign ranks polymorphically
            for (int i = 0; i < this.cachedLeaderboard.size(); i++) {
                this.cachedLeaderboard.get(i).setClassRank(i + 1);
            }

            this.lastLeaderboardUpdateTime = System.currentTimeMillis();
        }
    }

    /**
     * Multithreading: Thread-safe retrieval of cached leaderboard.
     */
    public List<Student> getCachedLeaderboardSynchronized() {
        synchronized (leaderboardLock) {
            return Collections.unmodifiableList(new ArrayList<>(this.cachedLeaderboard));
        }
    }

    /**
     * Records a category submission counter using atomic thread-safe ConcurrentHashMap.
     */
    public void incrementCategorySubmission(String category) {
        categorySubmissionCounters.compute(category, (k, current) -> (current == null) ? 1L : current + 1L);
    }

    public Map<String, Long> getCategorySubmissionCounts() {
        return Collections.unmodifiableMap(categorySubmissionCounters);
    }

    /**
     * Clean shutdown of background executor threads.
     */
    public void shutdown() {
        gradingThreadPool.shutdown();
        try {
            if (!gradingThreadPool.awaitTermination(3, TimeUnit.SECONDS)) {
                gradingThreadPool.shutdownNow();
            }
        } catch (InterruptedException e) {
            gradingThreadPool.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
