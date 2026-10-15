import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { Quiz, QuizDifficulty } from '../../types';
import {
  Search,
  Clock,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface QuizLibraryProps {
  onStartQuiz: (quiz: Quiz) => void;
}

export const QuizLibrary: React.FC<QuizLibraryProps> = ({ onStartQuiz }) => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const quizzes = useMemo(() => StorageService.getQuizzes(), []);
  const attempts = useMemo(() => StorageService.getAttemptsByUserId(userId), [userId]);

  // Categories list
  const categories = ['All', 'Core Java', 'OOP Concepts', 'Collections Framework', 'JDBC', 'Servlets & JSP'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Best score map per quiz
  const userScoresByQuiz = useMemo(() => {
    const map: Record<string, { best: number; attemptsCount: number; passed: boolean }> = {};
    attempts.forEach((a) => {
      if (!map[a.quizId]) {
        map[a.quizId] = { best: a.percentage, attemptsCount: 1, passed: a.passed };
      } else {
        map[a.quizId].best = Math.max(map[a.quizId].best, a.percentage);
        map[a.quizId].attemptsCount += 1;
        if (a.passed) map[a.quizId].passed = true;
      }
    });
    return map;
  }, [attempts]);

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || quiz.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || quiz.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [quizzes, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
          Java Quiz Catalog
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Select a verified assessment topic. Each test features real code snippets, strict timers, and comprehensive explanations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quizzes by keyword, topic, or concept (e.g. JVM, Collections, PreparedStatement)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
        </div>

        {/* Category Pills & Difficulty Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-lime-400 dark:bg-neutral-800 dark:text-lime-300 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-medium text-neutral-500">Difficulty:</span>
            <div className="flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111322] p-8">
          <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            No matching quizzes found
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or reset category and difficulty filters to explore all available quizzes.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuizzes.map((quiz) => {
            const userHistory = userScoresByQuiz[quiz.id];
            const questions = StorageService.getQuestionsByQuizId(quiz.id);
            const questionCount = questions.length;

            return (
              <div
                key={quiz.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              >
                <div>
                  {/* Top metadata unboxed text with separators */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2.5">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {quiz.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        quiz.difficulty === 'Beginner'
                          ? 'text-emerald-500'
                          : quiz.difficulty === 'Intermediate'
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white group-hover:text-lime-500 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                {/* Footer details & Action */}
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-4 font-mono-code tabular-nums">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {quiz.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                      {questionCount} questions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Pass {quiz.passPercentage}%
                    </span>
                  </div>

                  {/* Status if previously taken */}
                  {userHistory ? (
                    <div className="mb-3 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 text-xs flex items-center justify-between">
                      <span className="text-neutral-500 text-[11px]">Best Attempt:</span>
                      <span className="font-mono-code font-bold text-neutral-900 dark:text-white">
                        {userHistory.best}%{' '}
                        <span className={userHistory.passed ? 'text-lime-500' : 'text-rose-400'}>
                          ({userHistory.passed ? 'Passed' : 'Failed'})
                        </span>
                      </span>
                    </div>
                  ) : null}

                  <button
                    onClick={() => onStartQuiz(quiz)}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-900 dark:bg-neutral-800 group-hover:bg-lime-400 text-white group-hover:text-neutral-950 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {userHistory ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>Retake Exam</span>
                      </>
                    ) : (
                      <>
                        <span>Start Timed Quiz</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
