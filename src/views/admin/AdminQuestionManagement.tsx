import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Quiz, Question } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { JavaCodeBlock } from '../../components/common/JavaCodeBlock';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Terminal,
  X,
  Sparkles,
} from 'lucide-react';

interface AdminQuestionManagementProps {
  initialQuiz?: Quiz | null;
  onBackToQuizzes: () => void;
}

export const AdminQuestionManagement: React.FC<AdminQuestionManagementProps> = ({
  initialQuiz,
  onBackToQuizzes,
}) => {
  const { showToast } = useToast();
  const quizzes = StorageService.getQuizzes();
  const [selectedQuizId, setSelectedQuizId] = useState<string>(
    initialQuiz?.id || quizzes[0]?.id || ''
  );

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);
  const [questions, setQuestions] = useState<Question[]>(() =>
    StorageService.getQuestionsByQuizId(selectedQuizId)
  );

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Form inputs
  const [questionText, setQuestionText] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState<number>(1);

  const reloadQuestions = (quizId = selectedQuizId) => {
    setQuestions(StorageService.getQuestionsByQuizId(quizId));
  };

  const handleQuizChange = (newQuizId: string) => {
    setSelectedQuizId(newQuizId);
    reloadQuestions(newQuizId);
  };

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setCodeSnippet('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOptionIndex(0);
    setExplanation('');
    setMarks(1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setQuestionText(q.questionText);
    setCodeSnippet(q.codeSnippet || '');
    setOptionA(q.options[0] || '');
    setOptionB(q.options[1] || '');
    setOptionC(q.options[2] || '');
    setOptionD(q.options[3] || '');
    setCorrectOptionIndex(q.correctOptionIndex);
    setExplanation(q.explanation);
    setMarks(q.marks);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim() || !explanation.trim()) {
      showToast('Please fill in question text, all 4 options, and an explanation.', 'error');
      return;
    }

    const options: [string, string, string, string] = [
      optionA.trim(),
      optionB.trim(),
      optionC.trim(),
      optionD.trim(),
    ];

    if (editingQuestion) {
      StorageService.updateQuestion(editingQuestion.id, {
        questionText: questionText.trim(),
        codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
        options,
        correctOptionIndex,
        explanation: explanation.trim(),
        marks: Number(marks),
      });
      showToast('Question updated successfully.', 'success');
    } else {
      StorageService.createQuestion({
        quizId: selectedQuizId,
        questionText: questionText.trim(),
        codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
        options,
        correctOptionIndex,
        explanation: explanation.trim(),
        marks: Number(marks),
      });
      showToast('New question added to bank.', 'success');
    }

    setIsModalOpen(false);
    reloadQuestions();
  };

  const handleDeleteConfirm = () => {
    if (!questionToDelete) return;
    StorageService.deleteQuestion(questionToDelete.id);
    showToast('Question deleted from quiz bank.', 'info');
    setQuestionToDelete(null);
    reloadQuestions();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar with back button & quiz selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToQuizzes}
            className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-300"
            title="Back to Quizzes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
              Question Bank Editor
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Managing MCQ problems for: <strong className="text-neutral-900 dark:text-white">{selectedQuiz?.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Quiz selector */}
          <select
            value={selectedQuizId}
            onChange={(e) => handleQuizChange(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-md shadow-lime-400/20 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider font-mono-code">
            Total Questions in Quiz: {questions.length}
          </span>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              No questions found for this quiz yet.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-lime-400 text-neutral-950 hover:bg-lime-300"
            >
              Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-neutral-900 dark:bg-neutral-800 text-lime-400 text-xs font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                        {q.questionText}
                      </h4>
                      <span className="text-[11px] text-neutral-500 mt-0.5 block">
                        Weight: {q.marks} Mark
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setQuestionToDelete(q)}
                      className="p-1.5 rounded-lg border border-rose-300 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {q.codeSnippet && <JavaCodeBlock code={q.codeSnippet} />}

                {/* Options 4 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctOptionIndex;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          isCorrect
                            ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code font-bold">{letter}.</span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 mr-1">
                    Explanation:
                  </span>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-white">
              {editingQuestion ? 'Edit MCQ Question' : 'Add New MCQ Question'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Target Quiz: <strong>{selectedQuiz?.title}</strong>
            </p>

            <form onSubmit={handleSaveQuestion} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Question Text *
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the conceptual question or scenario..."
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-lime-500" />
                    <span>Java Code Snippet (Optional)</span>
                  </label>
                  <span className="text-[10px] text-neutral-400">Leave empty if not required</span>
                </div>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder={`public static void main(String[] args) {\n    // Code here\n}`}
                  rows={3}
                  className="w-full px-3 py-2 text-xs font-mono-code rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              {/* 4 Options with Radio to mark correct */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  4 Multiple Choice Options (Select radio for correct answer) *
                </label>

                {[
                  { label: 'Option A', val: optionA, setVal: setOptionA, idx: 0 },
                  { label: 'Option B', val: optionB, setVal: setOptionB, idx: 1 },
                  { label: 'Option C', val: optionC, setVal: setOptionC, idx: 2 },
                  { label: 'Option D', val: optionD, setVal: setOptionD, idx: 3 },
                ].map((item) => (
                  <div key={item.idx} className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={correctOptionIndex === item.idx}
                        onChange={() => setCorrectOptionIndex(item.idx)}
                        className="w-4 h-4 text-lime-500 accent-lime-400 cursor-pointer"
                      />
                      <span className="text-xs font-mono-code font-bold w-4">
                        {String.fromCharCode(65 + item.idx)}.
                      </span>
                    </label>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.setVal(e.target.value)}
                      placeholder={`Enter text for ${item.label}...`}
                      required
                      className={`flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-xl border ${
                        correctOptionIndex === item.idx
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-neutral-900 dark:text-white'
                          : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white'
                      } focus:outline-none focus:ring-1 focus:ring-lime-400`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Technical Explanation (Shown after quiz completion) *
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why the selected answer is correct according to Java Language Specification / JVM internals..."
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={marks}
                  onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
                  className="w-24 px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-sm shadow-lime-400/20"
                >
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Question Modal */}
      <ConfirmModal
        isOpen={!!questionToDelete}
        onClose={() => setQuestionToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question?"
        description="Are you sure you want to remove this question from the quiz? This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
};
