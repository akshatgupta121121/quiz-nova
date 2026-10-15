import React, { useMemo } from 'react';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { NavigationTab, Quiz } from '../../types';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  FileQuestion,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateQuiz: () => void;
  onSelectQuizForQuestions?: (quiz: Quiz) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenCreateQuiz,
  onSelectQuizForQuestions,
}) => {
  const { showToast } = useToast();
  const adminStats = useMemo(() => StorageService.getAdminStats(), []);

  const handleExportCSV = () => {
    StorageService.exportAttemptsToCSV();
    showToast('Student results exported to CSV successfully.', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Header & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <span>Staff Administration Console</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
            System & Academic Analytics
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time cohort performance, test completion volumes, and question bank metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenCreateQuiz}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all flex items-center gap-1.5 shadow-sm shadow-lime-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Quiz</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
            {adminStats.totalStudents}
          </div>
          <p className="mt-1 text-xs text-neutral-500">Active test candidates</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Published Quizzes</span>
            <BookOpen className="w-4 h-4 text-lime-500" />
          </div>
          <div className="mt-2 text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
            {adminStats.totalQuizzes}
          </div>
          <p className="mt-1 text-xs text-neutral-500">Across 5 Java modules</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Attempts Completed</span>
            <Award className="w-4 h-4 text-violet-500" />
          </div>
          <div className="mt-2 text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
            {adminStats.totalAttempts}
          </div>
          <p className="mt-1 text-xs text-neutral-500">Total verified submissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Platform Pass Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400 tabular-nums">
            {adminStats.platformPassRate}%
          </div>
          <p className="mt-1 text-xs text-neutral-500">Benchmark: 70% pass requirement</p>
        </div>
      </div>

      {/* Quiz Diagnostics Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Assessment Performance Matrix
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Breakdown of student submissions and pass yields across syllabus units
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin-quizzes')}
            className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline"
          >
            Manage All Quizzes →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                <th className="pb-3 font-semibold">Quiz Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Submissions</th>
                <th className="pb-3 font-semibold">Average Score</th>
                <th className="pb-3 font-semibold">Pass Rate</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {adminStats.quizPerformance.map((item) => (
                <tr
                  key={item.quizId}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="py-3.5 font-medium text-neutral-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className="py-3.5 text-neutral-500">{item.category}</td>
                  <td className="py-3.5 font-mono-code tabular-nums text-neutral-700 dark:text-neutral-300">
                    {item.totalAttempts}
                  </td>
                  <td className="py-3.5 font-mono-code tabular-nums font-semibold text-neutral-900 dark:text-white">
                    {item.averageScore}%
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-lime-400 rounded-full"
                          style={{ width: `${item.passRate}%` }}
                        />
                      </div>
                      <span className="font-mono-code tabular-nums text-neutral-600 dark:text-neutral-400">
                        {item.passRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => {
                        const targetQuiz = StorageService.getQuizById(item.quizId);
                        if (targetQuiz && onSelectQuizForQuestions) {
                          onSelectQuizForQuestions(targetQuiz);
                        } else {
                          onNavigate('admin-questions');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 transition-colors inline-flex items-center gap-1"
                    >
                      <FileQuestion className="w-3 h-3" />
                      <span>Questions</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Recent Cohort Submissions
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live submission stream from all registered students
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin-results')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Full Results Table →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Quiz Title</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Outcome</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {adminStats.recentAttempts.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="py-3">
                    <span className="font-semibold text-neutral-900 dark:text-white block">
                      {attempt.userName}
                    </span>
                    <span className="text-[11px] text-neutral-400">{attempt.userEmail}</span>
                  </td>
                  <td className="py-3 font-medium text-neutral-700 dark:text-neutral-300">
                    {attempt.quizTitle}
                  </td>
                  <td className="py-3 font-mono-code font-bold tabular-nums text-neutral-900 dark:text-white">
                    {attempt.score}/{attempt.totalQuestions} ({Math.round(attempt.percentage)}%)
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                        attempt.passed ? 'text-lime-500' : 'text-rose-500'
                      }`}
                    >
                      {attempt.passed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Passed
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 font-mono-code tabular-nums text-neutral-500">
                    {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
                  </td>
                  <td className="py-3 text-right text-neutral-500">
                    {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
