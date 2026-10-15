import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { ScoreTrendChart } from '../../components/charts/ScoreTrendChart';
import { CategoryAccuracyChart } from '../../components/charts/CategoryAccuracyChart';
import { Attempt } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  ExternalLink,
  Target,
  Sparkles,
  Layers,
} from 'lucide-react';

interface StudentPerformanceProps {
  onReviewAttempt: (attempt: Attempt) => void;
}

export const StudentPerformance: React.FC<StudentPerformanceProps> = ({
  onReviewAttempt,
}) => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Passed' | 'Failed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const attempts = useMemo(() => StorageService.getAttemptsByUserId(userId), [userId]);
  const stats = useMemo(() => StorageService.getStudentStats(userId), [userId]);

  const categories = ['All', 'Core Java', 'OOP Concepts', 'Collections Framework', 'JDBC', 'Servlets & JSP'];

  // Filter attempts
  const filteredAttempts = useMemo(() => {
    return attempts.filter((a) => {
      const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Passed' && a.passed) ||
        (statusFilter === 'Failed' && !a.passed);
      const matchesSearch =
        a.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [attempts, categoryFilter, statusFilter, searchQuery]);

  // Compute strengths and weaknesses
  const { strongestCategory, weakestCategory } = useMemo(() => {
    const entries = Object.entries(stats.categoryAccuracy);
    if (entries.length === 0) return { strongestCategory: null, weakestCategory: null };
    entries.sort((a, b) => b[1] - a[1]);
    return {
      strongestCategory: entries[0],
      weakestCategory: entries[entries.length - 1],
    };
  }, [stats.categoryAccuracy]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
          My Performance Analytics
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Longitudinal score trajectory, domain mastery analysis, and historical exam reviews.
        </p>
      </div>

      {/* Top Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Overall Accuracy</span>
            <Target className="w-4 h-4 text-lime-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
              {stats.averageScore}%
            </span>
            <span className="text-xs text-neutral-500">average score</span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Based on {stats.quizzesTaken} completed sessions
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Strongest Domain</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400">
              {strongestCategory ? strongestCategory[0] : 'None yet'}
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {strongestCategory ? `${strongestCategory[1]}% accuracy rating` : 'Take quizzes to identify strengths'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Area to Reinforce</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-display text-amber-600 dark:text-amber-400">
              {weakestCategory ? weakestCategory[0] : 'None yet'}
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {weakestCategory ? `${weakestCategory[1]}% accuracy rating` : 'Continue taking quizzes to diagnose gaps'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trendline (8 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
                Score Progression Over Time
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every quiz milestone mapped against the 70% threshold
              </p>
            </div>
          </div>
          <ScoreTrendChart data={stats.trendData} height={230} />
        </div>

        {/* Category Accuracy (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Syllabus Domain Accuracy
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Target 75%+ for industry certification readiness
            </p>
          </div>
          <CategoryAccuracyChart categoryAccuracy={stats.categoryAccuracy} />
        </div>
      </div>

      {/* History Table with Filters */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Exam History Log
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review any past attempt with question-level breakdown
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-neutral-900 text-lime-400 dark:bg-neutral-800'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1">
            {(['All', 'Passed', 'Failed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filteredAttempts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-500 text-xs">
            No historical attempts match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                  <th className="pb-3 font-semibold">Date Completed</th>
                  <th className="pb-3 font-semibold">Quiz Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Result</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredAttempts.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-3 text-neutral-500">
                      {new Date(a.completedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 font-medium text-neutral-900 dark:text-white max-w-[220px] truncate">
                      {a.quizTitle}
                    </td>
                    <td className="py-3 text-neutral-500">{a.category}</td>
                    <td className="py-3 font-mono-code font-bold tabular-nums text-neutral-900 dark:text-white">
                      {a.score}/{a.totalQuestions} ({Math.round(a.percentage)}%)
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          a.passed ? 'text-lime-500' : 'text-rose-500'
                        }`}
                      >
                        {a.passed ? (
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
                    <td className="py-3 text-neutral-500 font-mono-code tabular-nums">
                      {Math.floor(a.timeTakenSeconds / 60)}m {a.timeTakenSeconds % 60}s
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onReviewAttempt(a)}
                        className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Review</span>
                        <ExternalLink className="w-3 h-3" />
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
