/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationTab, Quiz, Attempt } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AuthModal } from './components/auth/AuthModal';
import { BackendCodeModal } from './components/backend/BackendCodeModal';

// Views
import { LandingPage } from './views/landing/LandingPage';
import { StudentDashboard } from './views/student/StudentDashboard';
import { QuizLibrary } from './views/student/QuizLibrary';
import { QuizTakingScreen } from './views/student/QuizTakingScreen';
import { QuizResultScreen } from './views/student/QuizResultScreen';
import { StudentPerformance } from './views/student/StudentPerformance';
import { LeaderboardView } from './views/student/LeaderboardView';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminQuizManagement } from './views/admin/AdminQuizManagement';
import { AdminQuestionManagement } from './views/admin/AdminQuestionManagement';
import { AdminResultsView } from './views/admin/AdminResultsView';

type AppViewMode = 'landing' | 'app' | 'taking-quiz' | 'quiz-result';

function MainAppContent() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    // If already logged in, go straight to app, otherwise landing
    return user ? 'app' : 'landing';
  });

  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    return isAdmin ? 'admin-dashboard' : 'dashboard';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<Attempt | null>(null);
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState<Quiz | null>(null);

  // Navigate handler
  const handleNavigate = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setViewMode('app');
  };

  // Start Quiz handler
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setViewMode('taking-quiz');
  };

  // Finish Quiz handler
  const handleFinishQuiz = (attempt: Attempt) => {
    setActiveAttempt(attempt);
    setViewMode('quiz-result');
  };

  // Review past attempt handler
  const handleReviewAttempt = (attempt: Attempt) => {
    setActiveAttempt(attempt);
    setViewMode('quiz-result');
  };

  // Retake Quiz handler
  const handleRetakeQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setViewMode('taking-quiz');
  };

  // If on landing page and not taking quiz or reviewing
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => {
            setViewMode('app');
            setCurrentTab(isAdmin ? 'admin-dashboard' : 'dashboard');
          }}
          onExploreQuizzes={() => {
            setViewMode('app');
            setCurrentTab('quizzes');
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // If taking quiz (focused exam environment)
  if (viewMode === 'taking-quiz' && activeQuiz) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0d19] text-neutral-900 dark:text-neutral-100 p-4 sm:p-6 lg:p-8">
        <QuizTakingScreen
          quiz={activeQuiz}
          onFinishQuiz={handleFinishQuiz}
          onCancel={() => {
            setActiveQuiz(null);
            setViewMode('app');
            setCurrentTab('quizzes');
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  // If reviewing quiz results
  if (viewMode === 'quiz-result' && activeAttempt) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0d19] text-neutral-900 dark:text-neutral-100 flex flex-col">
        <Navbar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenBackendCode={() => setIsBackendModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <QuizResultScreen
            attempt={activeAttempt}
            onRetakeQuiz={handleRetakeQuiz}
            onNavigate={(tab) => {
              setActiveAttempt(null);
              handleNavigate(tab);
            }}
          />
        </main>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <BackendCodeModal
          isOpen={isBackendModalOpen}
          onClose={() => setIsBackendModalOpen(false)}
        />
      </div>
    );
  }

  // Standard App Layout with Sidebar + Top Header + Main Content
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-[#0c0d19] text-neutral-900 dark:text-neutral-100">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenBackendCode={() => setIsBackendModalOpen(true)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenBackendCode={() => setIsBackendModalOpen(true)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
          {/* Student Views */}
          {currentTab === 'dashboard' && (
            <StudentDashboard
              onNavigate={handleNavigate}
              onStartQuiz={handleStartQuiz}
              onReviewAttempt={handleReviewAttempt}
            />
          )}

          {currentTab === 'quizzes' && (
            <QuizLibrary onStartQuiz={handleStartQuiz} />
          )}

          {currentTab === 'performance' && (
            <StudentPerformance onReviewAttempt={handleReviewAttempt} />
          )}

          {currentTab === 'leaderboard' && <LeaderboardView />}

          {/* Admin Views */}
          {currentTab === 'admin-dashboard' && (
            <AdminDashboard
              onNavigate={handleNavigate}
              onOpenCreateQuiz={() => handleNavigate('admin-quizzes')}
              onSelectQuizForQuestions={(quiz) => {
                setSelectedQuizForQuestions(quiz);
                setCurrentTab('admin-questions');
              }}
            />
          )}

          {currentTab === 'admin-quizzes' && (
            <AdminQuizManagement
              onSelectQuizForQuestions={(quiz) => {
                setSelectedQuizForQuestions(quiz);
                setCurrentTab('admin-questions');
              }}
            />
          )}

          {currentTab === 'admin-questions' && (
            <AdminQuestionManagement
              initialQuiz={selectedQuizForQuestions}
              onBackToQuizzes={() => handleNavigate('admin-quizzes')}
            />
          )}

          {currentTab === 'admin-results' && (
            <AdminResultsView onReviewAttempt={handleReviewAttempt} />
          )}
        </main>

        {/* Mobile Navigation Bar */}
        <MobileNav currentTab={currentTab} onNavigate={handleNavigate} />
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <BackendCodeModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
