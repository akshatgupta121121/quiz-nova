import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Quiz, QuizDifficulty } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FileQuestion,
  Clock,
  Award,
  Layers,
  X,
  CheckCircle2,
} from 'lucide-react';

interface AdminQuizManagementProps {
  onSelectQuizForQuestions: (quiz: Quiz) => void;
}

export const AdminQuizManagement: React.FC<AdminQuizManagementProps> = ({
  onSelectQuizForQuestions,
}) => {
  const { showToast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => StorageService.getQuizzes());
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Core Java');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Intermediate');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passPercentage, setPassPercentage] = useState(70);

  const categories = ['Core Java', 'OOP Concepts', 'Collections Framework', 'JDBC', 'Servlets & JSP', 'JVM & Concurrency', 'Spring & Frameworks'];

  const reloadQuizzes = () => {
    setQuizzes(StorageService.getQuizzes());
  };

  const handleOpenCreate = () => {
    setEditingQuiz(null);
    setTitle('');
    setDescription('');
    setCategory('Core Java');
    setDifficulty('Intermediate');
    setDurationMinutes(15);
    setPassPercentage(70);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setTitle(quiz.title);
    setDescription(quiz.description);
    setCategory(quiz.category);
    setDifficulty(quiz.difficulty);
    setDurationMinutes(quiz.durationMinutes);
    setPassPercentage(quiz.passPercentage);
    setIsModalOpen(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please enter title and description.', 'error');
      return;
    }

    if (editingQuiz) {
      StorageService.updateQuiz(editingQuiz.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        durationMinutes: Number(durationMinutes),
        passPercentage: Number(passPercentage),
      });
      showToast(`Quiz "${title}" updated.`, 'success');
    } else {
      const newQuiz = StorageService.createQuiz({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        durationMinutes: Number(durationMinutes),
        passPercentage: Number(passPercentage),
      });
      showToast(`Quiz "${newQuiz.title}" created! You can now add questions.`, 'success');
    }

    setIsModalOpen(false);
    reloadQuizzes();
  };

  const handleDeleteConfirm = () => {
    if (!quizToDelete) return;
    StorageService.deleteQuiz(quizToDelete.id);
    showToast(`Quiz "${quizToDelete.title}" and its questions deleted.`, 'info');
    setQuizToDelete(null);
    reloadQuizzes();
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
            Quiz Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Create, configure, and maintain technical assessments in the syllabus.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-md shadow-lime-400/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quizzes by title or category..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>
      </div>

      {/* Quizzes Table / Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider font-mono-code">
            Total Quizzes: {filteredQuizzes.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                <th className="pb-3 font-semibold">Quiz Info</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Difficulty</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Pass Mark</th>
                <th className="pb-3 font-semibold">Questions</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredQuizzes.map((quiz) => {
                const questionCount = StorageService.getQuestionsByQuizId(quiz.id).length;

                return (
                  <tr
                    key={quiz.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-3.5 max-w-[260px]">
                      <span className="font-bold text-neutral-900 dark:text-white block text-sm">
                        {quiz.title}
                      </span>
                      <span className="text-neutral-500 line-clamp-1 mt-0.5">
                        {quiz.description}
                      </span>
                    </td>
                    <td className="py-3.5 text-neutral-600 dark:text-neutral-400 font-medium">
                      {quiz.category}
                    </td>
                    <td className="py-3.5">
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
                    </td>
                    <td className="py-3.5 font-mono-code tabular-nums text-neutral-600 dark:text-neutral-400">
                      {quiz.durationMinutes} min
                    </td>
                    <td className="py-3.5 font-mono-code tabular-nums font-semibold text-neutral-900 dark:text-white">
                      {quiz.passPercentage}%
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => onSelectQuizForQuestions(quiz)}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                      >
                        <FileQuestion className="w-3 h-3" />
                        <span>{questionCount} Questions</span>
                      </button>
                    </td>
                    <td className="py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => onSelectQuizForQuestions(quiz)}
                        className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Manage Questions"
                      >
                        <FileQuestion className="w-3.5 h-3.5 text-indigo-400" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(quiz)}
                        className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit Quiz Metadata"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setQuizToDelete(quiz)}
                        className="p-1.5 rounded-lg border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-white">
              {editingQuiz ? 'Edit Quiz Configuration' : 'Create New Assessment'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Configure parameters that map to the Java backend database tables
            </p>

            <form onSubmit={handleSaveQuiz} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. JVM Memory Management & Garbage Collection"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly summarize the syllabus concepts tested in this quiz..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as QuizDifficulty)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Pass Benchmark (% Required)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(parseInt(e.target.value) || 50)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
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
                  {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!quizToDelete}
        onClose={() => setQuizToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assessment?"
        description={`Are you sure you want to delete "${quizToDelete?.title}"? All associated questions will also be permanently deleted.`}
        confirmLabel="Yes, Delete Quiz"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
};
