import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Attempt } from '../../types';
import {
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Users,
} from 'lucide-react';

interface AdminResultsViewProps {
  onReviewAttempt: (attempt: Attempt) => void;
}

export const AdminResultsView: React.FC<AdminResultsViewProps> = ({ onReviewAttempt }) => {
  const { showToast } = useToast();
  const quizzes = StorageService.getQuizzes();
  const [attempts, setAttempts] = useState<Attempt[]>(() => StorageService.getAttempts());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Passed' | 'Failed'>('All');

  const handleExportCSV = () => {
    StorageService.exportAttemptsToCSV();
    showToast('Cohort results exported as CSV successfully.', 'success');
  };

  const filteredAttempts = useMemo(() => {
    return attempts.filter((a) => {
      const matchesSearch =
        a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesQuiz = selectedQuizId === 'All' || a.quizId === selectedQuizId;
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Passed' && a.passed) ||
        (selectedStatus === 'Failed' && !a.passed);

      return matchesSearch && matchesQuiz && matchesStatus;
    });
  }, [attempts, searchQuery, selectedQuizId, selectedStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
            Candidate Submissions & Results
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Complete audit trail of all student quiz attempts, score marks, and timestamps.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-md shadow-lime-400/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export All to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, email, or quiz title..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-800/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Quiz Filter:
            </span>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-lime-400"
            >
              <option value="All">All Quizzes</option>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-500 font-medium mr-1">Status:</span>
            {(['All', 'Passed', 'Failed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  selectedStatus === st
                    ? 'bg-neutral-900 text-lime-400 dark:bg-neutral-800 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
          <span>Showing {filteredAttempts.length} submissions</span>
        </div>

        {filteredAttempts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-500 text-xs">
            No student results match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                  <th className="pb-3 font-semibold">Student Candidate</th>
                  <th className="pb-3 font-semibold">Quiz Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Score Breakdown</th>
                  <th className="pb-3 font-semibold">Result</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Completed Date</th>
                  <th className="pb-3 font-semibold text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredAttempts.map((attempt) => (
                  <tr
                    key={attempt.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-3.5">
                      <span className="font-semibold text-neutral-900 dark:text-white block">
                        {attempt.userName}
                      </span>
                      <span className="text-[11px] text-neutral-400">{attempt.userEmail}</span>
                    </td>
                    <td className="py-3.5 font-medium text-neutral-800 dark:text-neutral-200 max-w-[200px] truncate">
                      {attempt.quizTitle}
                    </td>
                    <td className="py-3.5 text-neutral-500">{attempt.category}</td>
                    <td className="py-3.5 font-mono-code tabular-nums font-bold text-neutral-900 dark:text-white">
                      {attempt.score}/{attempt.totalQuestions} ({Math.round(attempt.percentage)}%)
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          attempt.passed ? 'text-lime-500' : 'text-rose-500'
                        }`}
                      >
                        {attempt.passed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pass
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Fail
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 text-neutral-500 font-mono-code tabular-nums">
                      {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
                    </td>
                    <td className="py-3.5 text-neutral-500">
                      {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onReviewAttempt(attempt)}
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
