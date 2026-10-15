import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { ScoreTrendChart } from '../../components/charts/ScoreTrendChart';
import { CategoryAccuracyChart } from '../../components/charts/CategoryAccuracyChart';
import { Quiz, Attempt, NavigationTab } from '../../types';
import {
  Trophy,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: NavigationTab) => void;
  onStartQuiz: (quiz: Quiz) => void;
  onReviewAttempt: (attempt: Attempt) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onStartQuiz,
  onReviewAttempt,
}) => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const studentStats = useMemo(() => {
    return StorageService.getStudentStats(userId);
  }, [userId]);

  const quizzes = useMemo(() => {
    return StorageService.getQuizzes();
  }, []);

  // Find a recommended quiz not yet taken, or highest priority
  const recommendedQuiz = useMemo(() => {
    const attempts = StorageService.getAttemptsByUserId(userId);
    const takenQuizIds = new Set(attempts.map((a) => a.quizId));
    const unattempted = quizzes.find((q) => !takenQuizIds.has(q.id));
    return unattempted || quizzes[0];
  }, [quizzes, userId]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 border border-neutral-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Targeting Full-Stack Java Certification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Welcome back, {user?.name || 'Developer'}!
          </h1>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Track your progress across Core Java, Collections, Multithreading, JDBC, and Servlets. 
            Test your knowledge under timed conditions with real JVM benchmarks.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {recommendedQuiz && (
              <button
                onClick={() => onStartQuiz(recommendedQuiz)}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-md shadow-lime-400/20 flex items-center gap-2"
              >
                <span>Start Recommended: {recommendedQuiz.category}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onNavigate('quizzes')}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-neutral-400" />
              Browse All 5 Quizzes
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-10 w-60 h-60 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Quizzes Taken */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Quizzes Taken</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
              {studentStats.quizzesTaken}
            </span>
            <span className="text-xs text-neutral-500">tests</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
            <span className="text-emerald-500 font-semibold">{studentStats.passedCount} passed</span>
            <span>·</span>
            <span>{studentStats.quizzesTaken - studentStats.passedCount} review</span>
          </div>
        </div>

        {/* Card 2: Average Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-lime-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
              {studentStats.averageScore}%
            </span>
            <span className="text-xs text-neutral-500">avg</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            {studentStats.averageScore >= 70 ? (
              <span className="text-lime-500 font-medium">Above pass benchmark</span>
            ) : (
              <span className="text-amber-500 font-medium">Below pass target (70%)</span>
            )}
          </div>
        </div>

        {/* Card 3: Best Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Best Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
              {studentStats.bestScore}%
            </span>
            <span className="text-xs text-neutral-500">personal best</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            {studentStats.bestScore === 100 ? 'Perfect 100% score!' : 'Targeting 100% mastery'}
          </div>
        </div>

        {/* Card 4: Global Rank */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Class Rank</span>
            <Trophy className="w-4 h-4 text-violet-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
              #{studentStats.rank}
            </span>
            <span className="text-xs text-neutral-500">overall</span>
          </div>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>View leaderboard</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Analytics Section: Trend Chart & Category Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Trendline */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white">
                Performance Trajectory
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Score progression across your sequential quiz submissions
              </p>
            </div>
            <span className="text-xs font-mono-code font-semibold px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {studentStats.trendData.length} records
            </span>
          </div>

          <ScoreTrendChart data={studentStats.trendData} height={220} />
        </div>

        {/* Right 1 Col: Category Mastery */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white">
            Category Mastery
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 mb-5">
            Average accuracy across core Java domains
          </p>

          <CategoryAccuracyChart categoryAccuracy={studentStats.categoryAccuracy} />
        </div>
      </div>

      {/* Recent Attempts Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Recent Submissions
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Review your answers, correct solutions, and timing logs
            </p>
          </div>
          <button
            onClick={() => onNavigate('performance')}
            className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {studentStats.recentAttempts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
            <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              No quiz attempts yet
            </p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Select a quiz from the library to test your Java knowledge and record your performance stats.
            </p>
            <button
              onClick={() => onNavigate('quizzes')}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-colors"
            >
              Browse Quizzes
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                  <th className="pb-3 font-semibold">Quiz Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Time Taken</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {studentStats.recentAttempts.map((attempt) => (
                  <tr
                    key={attempt.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-3.5 font-medium text-neutral-900 dark:text-white max-w-[200px] truncate">
                      {attempt.quizTitle}
                    </td>
                    <td className="py-3.5 text-neutral-600 dark:text-neutral-400">
                      {attempt.category}
                    </td>
                    <td className="py-3.5 font-mono-code font-bold tabular-nums text-neutral-900 dark:text-white">
                      {attempt.score}/{attempt.totalQuestions} ({Math.round(attempt.percentage)}%)
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          attempt.passed
                            ? 'text-lime-600 dark:text-lime-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {attempt.passed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pass
                          </>
                        ) : (
                          'Fail'
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 text-neutral-500 font-mono-code tabular-nums">
                      {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
                    </td>
                    <td className="py-3.5 text-neutral-500">
                      {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onReviewAttempt(attempt)}
                        className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
