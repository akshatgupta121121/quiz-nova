import React, { useState, useEffect, useRef } from 'react';
import { Quiz, Question, Attempt } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { JavaCodeBlock } from '../../components/common/JavaCodeBlock';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface QuizTakingScreenProps {
  quiz: Quiz;
  onFinishQuiz: (attempt: Attempt) => void;
  onCancel: () => void;
}

export const QuizTakingScreen: React.FC<QuizTakingScreenProps> = ({
  quiz,
  onFinishQuiz,
  onCancel,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const questions: Question[] = React.useMemo(() => {
    return StorageService.getQuestionsByQuizId(quiz.id);
  }, [quiz.id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  // Answers map: questionId -> selectedOptionIndex (0, 1, 2, 3) or null
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>({});
  // Review set
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());

  // Timer: durationMinutes * 60 seconds
  const totalDurationSeconds = quiz.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDurationSeconds);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  const currentQuestion = questions[currentIndex];

  // Live Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmitTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAutoSubmitTimeUp = () => {
    setIsTimeUpModalOpen(true);
    showToast("Time has expired! Submitting your quiz now...", "error");
    setTimeout(() => {
      submitQuiz(true);
    }, 1200);
  };

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  // Clear answer
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  // Toggle review flag
  const handleToggleReview = () => {
    if (!currentQuestion) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  // Compute answers summary
  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== null && userAnswers[k] !== undefined
  ).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const reviewCount = markedForReview.size;

  // Final Submit Quiz calculation
  const submitQuiz = (wasAutoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTakenSeconds = Math.max(
      1,
      Math.min(totalDurationSeconds, Math.floor((Date.now() - startTimeRef.current) / 1000))
    );

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === undefined || selected === null) {
        skippedCount++;
      } else if (selected === q.correctOptionIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const totalQuestions = questions.length;
    const score = correctCount;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const passed = percentage >= quiz.passPercentage;

    const attempt = StorageService.recordAttempt({
      userId: user?.id || 'guest_student',
      userName: user?.name || 'Guest Student',
      userEmail: user?.email || 'student@quiznova.com',
      quizId: quiz.id,
      quizTitle: quiz.title,
      category: quiz.category,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: skippedCount,
      percentage: Math.round(percentage * 10) / 10,
      passed,
      timeTakenSeconds,
      userAnswers,
    });

    if (wasAutoSubmit) {
      showToast('Quiz auto-submitted as time expired.', 'info');
    } else {
      showToast(passed ? 'Congratulations! Quiz passed.' : 'Quiz completed. Keep practicing!', passed ? 'success' : 'info');
    }

    onFinishQuiz(attempt);
  };

  // Format timer
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = secondsRemaining < 120; // less than 2 minutes left

  const progressPercentage = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200 dark:border-neutral-800">
        <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
          This quiz does not currently have questions configured.
        </p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Exam Header with Live Timer and Progress */}
      <div className="sticky top-16 z-20 rounded-2xl bg-white/95 dark:bg-[#111322]/95 border border-neutral-200 dark:border-neutral-800 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {quiz.category}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-display text-neutral-900 dark:text-white truncate max-w-md">
              {quiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Live Timer Pill */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono-code font-bold text-sm tabular-nums transition-all ${
                isUrgent
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 animate-pulse shadow-sm shadow-rose-500/20'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-500' : 'text-neutral-400'}`} />
              <span>{formattedTime}</span>
            </div>

            {/* Cancel/Exit button */}
            <button
              onClick={() => setIsExitModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Exit
            </button>

            {/* Submit Quiz CTA */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-md shadow-lime-400/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Quiz</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span>Overall Progress: {answeredCount} answered ({progressPercentage}%)</span>
            {reviewCount > 0 && (
              <span className="text-amber-500 font-medium">{reviewCount} marked for review</span>
            )}
          </div>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-lime-400 transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Question Content (Left 8 Cols) + Question Palette (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Current Question Area */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 p-6 sm:p-7 shadow-sm">
          <div>
            {/* Question status tags */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono-code bg-neutral-900 text-lime-400 dark:bg-neutral-800">
                  Q{currentIndex + 1}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {currentQuestion.marks} Mark
                </span>
              </div>

              {/* Mark for review toggle */}
              <button
                type="button"
                onClick={handleToggleReview}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  markedForReview.has(currentQuestion.id)
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${markedForReview.has(currentQuestion.id) ? 'fill-current' : ''}`} />
                <span>{markedForReview.has(currentQuestion.id) ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-relaxed">
              {currentQuestion.questionText}
            </h3>

            {/* Optional Java Code Snippet */}
            {currentQuestion.codeSnippet && (
              <JavaCodeBlock code={currentQuestion.codeSnippet} />
            )}

            {/* 4 MCQ Options */}
            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = userAnswers[currentQuestion.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'border-lime-500 bg-lime-400/10 dark:bg-lime-400/5 text-neutral-900 dark:text-white shadow-sm ring-1 ring-lime-500'
                        : 'border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/80'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 font-mono-code transition-colors ${
                        isSelected
                          ? 'bg-lime-400 text-neutral-950 shadow-sm'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className="text-sm font-medium leading-relaxed pt-0.5">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClearResponse}
              disabled={userAnswers[currentQuestion.id] === undefined}
              className="text-xs font-semibold text-neutral-500 hover:text-rose-500 transition-colors disabled:opacity-40 disabled:hover:text-neutral-500 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Choice</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Finish & Submit</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Navigator Palette */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-sm space-y-5">
          <div>
            <h4 className="text-sm font-bold font-display text-neutral-900 dark:text-white">
              Question Navigator
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Jump directly to any problem
            </p>
          </div>

          {/* Grid of question buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
              const isMarked = markedForReview.has(q.id);
              const isCurrent = idx === currentIndex;

              let btnStyle = 'bg-neutral-100 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700';

              if (isMarked) {
                btnStyle = 'bg-amber-500/20 text-amber-500 border-amber-500/50 font-bold';
              } else if (isAnswered) {
                btnStyle = 'bg-lime-500/20 text-lime-600 dark:text-lime-400 border-lime-500/50 font-bold';
              }

              if (isCurrent) {
                btnStyle += ' ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-neutral-900';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 rounded-xl border text-xs font-mono-code transition-all flex items-center justify-center relative ${btnStyle}`}
                >
                  <span>{idx + 1}</span>
                  {isMarked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-md bg-lime-500/20 border border-lime-500/50" />
              <span className="text-neutral-600 dark:text-neutral-400">Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-md bg-amber-500/20 border border-amber-500/50" />
              <span className="text-neutral-600 dark:text-neutral-400">Marked for Review ({reviewCount})</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
              <span className="text-neutral-600 dark:text-neutral-400">Not Visited / Skipped ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-md border-2 border-indigo-500" />
              <span className="text-neutral-600 dark:text-neutral-400">Current Question</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      <ConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={() => submitQuiz(false)}
        title="Confirm Final Submission?"
        description={`You have completed ${answeredCount} of ${questions.length} questions. ${
          unansweredCount > 0
            ? `${unansweredCount} questions remain unanswered.`
            : 'All questions have an answer recorded.'
        } ${reviewCount > 0 ? `(${reviewCount} questions are still marked for review).` : ''} Are you ready to submit and calculate your score?`}
        confirmLabel="Yes, Submit My Exam"
        cancelLabel="Continue Test"
      />

      {/* Exit Exam Modal */}
      <ConfirmModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={onCancel}
        title="Abandon Quiz Session?"
        description="Are you sure you want to quit this timed exam? Unsaved progress for this session will not be counted."
        confirmLabel="Exit Exam"
        cancelLabel="Resume Quiz"
        isDestructive={true}
      />
    </div>
  );
};
