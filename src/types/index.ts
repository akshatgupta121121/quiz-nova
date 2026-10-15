export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  joinedAt: string;
}

export type QuizDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'Core Java' | 'OOP Concepts' | 'Collections Framework' | 'JDBC' | 'Servlets & JSP' | string;
  difficulty: QuizDifficulty;
  durationMinutes: number;
  passPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  correctOptionIndex: number; // 0, 1, 2, 3
  explanation: string;
  marks: number;
}

export interface Attempt {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  quizId: string;
  quizTitle: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  completedAt: string;
  userAnswers: Record<string, number | null>; // questionId -> selectedOptionIndex (0-3) or null if skipped
}

export interface LeaderboardUser {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  quizzesTaken: number;
  averagePercentage: number;
  bestPercentage: number;
  lastActive: string;
  rank?: number;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'quizzes' 
  | 'performance' 
  | 'leaderboard'
  | 'admin-dashboard' 
  | 'admin-quizzes' 
  | 'admin-questions' 
  | 'admin-results';
