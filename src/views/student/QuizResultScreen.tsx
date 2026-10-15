import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Attempt, Question, Quiz, NavigationTab } from '../../types';
import { StorageService } from '../../services/storageService';
import { ScoreRing } from '../../components/common/ScoreRing';
import { JavaCodeBlock } from '../../components/common/JavaCodeBlock';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Share2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface QuizResultScreenProps {
  attempt: Attempt;
  onRetakeQuiz: (quiz: Quiz) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  attempt,
  onRetakeQuiz,
  onNavigate,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');

  const quiz = StorageService.getQuizById(attempt.quizId);
  const questions: Question[] = StorageService.getQuestionsByQuizId(attempt.quizId);

  // Trigger confetti burst if passed
  useEffect(() => {
    if (attempt.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a3e635', '#bef264', '#6366f1', '#818cf8', '#ffffff'],
        });
      } catch (e) {
        console.error('Confetti trigger ignored', e);
      }
    }
  }, [attempt.passed]);

  // Review questions filtering
  const filteredQuestions = questions.filter((q) => {
    const selected = attempt.userAnswers[q.id];
    const isCorrect = selected === q.correctOptionIndex;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  const minutes = Math.floor(attempt.timeTakenSeconds / 60);
  const seconds = attempt.timeTakenSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;
  const avgPacePerQuestion = Math.round(attempt.timeTakenSeconds / Math.max(1, attempt.totalQuestions));

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Score Ring Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Summary text & pass badge */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <span>{attempt.category}</span>
              <span>·</span>
              <span>Assessment Completed</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 dark:text-white">
              {attempt.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed'}
            </h1>

            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
              {attempt.passed
                ? `Outstanding performance on "${attempt.quizTitle}". You have demonstrated core competence with a final mark of ${attempt.percentage}%.`
                : `You scored ${attempt.percentage}%, which is below the benchmark (${quiz?.passPercentage || 70}%). Review the annotated explanations below and retake the test to achieve full mastery.`}
            </p>

            {/* Quick Action buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {quiz && (
                <button
                  onClick={() => onRetakeQuiz(quiz)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all flex items-center gap-2 shadow-md shadow-lime-400/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('performance')}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span>View Full Performance</span>
              </button>
              <button
                onClick={() => onNavigate('quizzes')}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Back to Library</span>
              </button>
            </div>
          </div>

          {/* Right: Circular Score Ring */}
          <div className="shrink-0 flex flex-col items-center">
            <ScoreRing
              score={attempt.percentage}
              size={180}
              strokeWidth={14}
              passed={attempt.passed}
            />
            <span className="text-xs text-neutral-400 mt-2 font-medium">
              Passing requirement: {quiz?.passPercentage || 70}%
            </span>
          </div>
        </div>

        {/* Metric Badges Grid */}
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct</span>
            </div>
            <p className="mt-1 text-2xl font-bold font-mono-code tabular-nums text-emerald-600 dark:text-emerald-400">
              {attempt.correctAnswers}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              <XCircle className="w-4 h-4" />
              <span>Wrong</span>
            </div>
            <p className="mt-1 text-2xl font-bold font-mono-code tabular-nums text-rose-600 dark:text-rose-400">
              {attempt.wrongAnswers}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-center">
            <div className="flex items-center justify-center gap-1.5 text-neutral-600 dark:text-neutral-400 text-xs font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>Skipped</span>
            </div>
            <p className="mt-1 text-2xl font-bold font-mono-code tabular-nums text-neutral-700 dark:text-neutral-300">
              {attempt.skippedAnswers}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              <span>Time Taken</span>
            </div>
            <p className="mt-1 text-xl font-bold font-mono-code tabular-nums text-indigo-600 dark:text-indigo-400 pt-0.5">
              {timeFormatted}
            </p>
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
              Question-by-Question Solution Review
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Examine the verified answers and detailed JVM reasoning for each problem
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterMode === 'incorrect'
                  ? 'bg-white dark:bg-neutral-900 text-rose-500 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Needs Work ({attempt.wrongAnswers + attempt.skippedAnswers})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterMode === 'correct'
                  ? 'bg-white dark:bg-neutral-900 text-lime-500 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Correct ({attempt.correctAnswers})
            </button>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-5">
          {filteredQuestions.map((q, qIndex) => {
            const selected = attempt.userAnswers[q.id];
            const isCorrect = selected === q.correctOptionIndex;
            const isSkipped = selected === undefined || selected === null;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/[0.02]'
                    : isSkipped
                    ? 'border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30'
                    : 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/[0.02]'
                }`}
              >
                {/* Header status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      Q{qIndex + 1}
                    </span>
                    <span className="text-xs text-neutral-500">{q.marks} Mark</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      isCorrect
                        ? 'text-emerald-500'
                        : isSkipped
                        ? 'text-neutral-500'
                        : 'text-rose-500'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Correct (+{q.marks})
                      </>
                    ) : isSkipped ? (
                      <>
                        <HelpCircle className="w-4 h-4" />
                        Skipped (0)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Incorrect (0)
                      </>
                    )}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                  {q.questionText}
                </p>

                {/* Optional code snippet */}
                {q.codeSnippet && <JavaCodeBlock code={q.codeSnippet} />}

                {/* Options List */}
                <div className="mt-4 space-y-2">
                  {q.options.map((optText, optIdx) => {
                    const isUserChoice = selected === optIdx;
                    const isCorrectAnswer = optIdx === q.correctOptionIndex;
                    const letter = String.fromCharCode(65 + optIdx);

                    let optClass = 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900/40';

                    if (isCorrectAnswer) {
                      optClass = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500';
                    } else if (isUserChoice && !isCorrect) {
                      optClass = 'border-rose-500/80 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold ring-1 ring-rose-500';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono-code font-bold">{letter}.</span>
                          <span>{optText}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isCorrectAnswer && (
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                              Correct Answer
                            </span>
                          )}
                          {isUserChoice && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                              }`}
                            >
                              Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* In-depth Pedagogical Explanation */}
                <div className="mt-4 p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                    <span>Technical Explanation & JVM Mechanic:</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
