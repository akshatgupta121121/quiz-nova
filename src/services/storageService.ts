import { User, Quiz, Question, Attempt, LeaderboardUser } from '../types';
import { INITIAL_USERS, INITIAL_QUIZZES, INITIAL_QUESTIONS, INITIAL_ATTEMPTS } from './seedData';

const STORAGE_KEYS = {
  USERS: 'quiznova_db_users',
  QUIZZES: 'quiznova_db_quizzes',
  QUESTIONS: 'quiznova_db_questions',
  ATTEMPTS: 'quiznova_db_attempts',
  CURRENT_USER: 'quiznova_session_user',
  THEME: 'quiznova_ui_theme',
};

// Safe JSON parser
function safeParse<T>(data: string | null, fallback: T): T {
  if (!data) return fallback;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    console.error('Error parsing storage data', e);
    return fallback;
  }
}

export class StorageService {
  /**
   * Initializes database with seed records if tables are empty
   */
  static initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
    }
  }

  static resetToSeed(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
  }

  // ================= USERS TABLE =================
  static getUsers(): User[] {
    this.initialize();
    return safeParse<User[]>(localStorage.getItem(STORAGE_KEYS.USERS), INITIAL_USERS);
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static createUser(user: Omit<User, 'id' | 'joinedAt'>): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      joinedAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return { success: true, user: newUser };
  }

  // ================= QUIZZES TABLE =================
  static getQuizzes(): Quiz[] {
    this.initialize();
    return safeParse<Quiz[]>(localStorage.getItem(STORAGE_KEYS.QUIZZES), INITIAL_QUIZZES);
  }

  static getQuizById(id: string): Quiz | undefined {
    return this.getQuizzes().find((q) => q.id === id);
  }

  static createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Quiz {
    const quizzes = this.getQuizzes();
    const now = new Date().toISOString();
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    quizzes.push(newQuiz);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return newQuiz;
  }

  static updateQuiz(quizId: string, updates: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Quiz | null {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex((q) => q.id === quizId);
    if (index === -1) return null;

    quizzes[index] = {
      ...quizzes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return quizzes[index];
  }

  static deleteQuiz(quizId: string): boolean {
    const quizzes = this.getQuizzes().filter((q) => q.id !== quizId);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));

    // Cascade delete questions associated with this quiz
    const questions = this.getAllQuestions().filter((q) => q.quizId !== quizId);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return true;
  }

  // ================= QUESTIONS TABLE =================
  static getAllQuestions(): Question[] {
    this.initialize();
    return safeParse<Question[]>(localStorage.getItem(STORAGE_KEYS.QUESTIONS), INITIAL_QUESTIONS);
  }

  static getQuestionsByQuizId(quizId: string): Question[] {
    return this.getAllQuestions().filter((q) => q.quizId === quizId);
  }

  static createQuestion(question: Omit<Question, 'id'>): Question {
    const questions = this.getAllQuestions();
    const newQuestion: Question = {
      ...question,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    questions.push(newQuestion);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return newQuestion;
  }

  static updateQuestion(id: string, updates: Partial<Omit<Question, 'id' | 'quizId'>>): Question | null {
    const questions = this.getAllQuestions();
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return null;

    questions[index] = {
      ...questions[index],
      ...updates,
    };
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return questions[index];
  }

  static deleteQuestion(id: string): boolean {
    const questions = this.getAllQuestions().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return true;
  }

  // ================= ATTEMPTS TABLE =================
  static getAttempts(): Attempt[] {
    this.initialize();
    return safeParse<Attempt[]>(localStorage.getItem(STORAGE_KEYS.ATTEMPTS), INITIAL_ATTEMPTS);
  }

  static getAttemptsByUserId(userId: string): Attempt[] {
    return this.getAttempts()
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  static getAttemptsByQuizId(quizId: string): Attempt[] {
    return this.getAttempts()
      .filter((a) => a.quizId === quizId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  static getAttemptById(attemptId: string): Attempt | undefined {
    return this.getAttempts().find((a) => a.id === attemptId);
  }

  static recordAttempt(attemptData: Omit<Attempt, 'id' | 'completedAt'>): Attempt {
    const attempts = this.getAttempts();
    const newAttempt: Attempt = {
      ...attemptData,
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      completedAt: new Date().toISOString(),
    };
    attempts.push(newAttempt);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    return newAttempt;
  }

  // ================= ANALYTICS & STATS =================
  static getStudentStats(userId: string) {
    const attempts = this.getAttemptsByUserId(userId);
    const totalTaken = attempts.length;
    if (totalTaken === 0) {
      return {
        quizzesTaken: 0,
        averageScore: 0,
        bestScore: 0,
        passedCount: 0,
        rank: this.calculateStudentRank(userId),
        recentAttempts: [],
        trendData: [],
        categoryAccuracy: {},
      };
    }

    const avgScore = Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalTaken);
    const bestScore = Math.round(Math.max(...attempts.map((a) => a.percentage)));
    const passedCount = attempts.filter((a) => a.passed).length;

    // Trendline data sorted chronological
    const chronological = [...attempts].reverse();
    const trendData = chronological.map((a, idx) => ({
      attemptIndex: idx + 1,
      quizTitle: a.quizTitle,
      percentage: Math.round(a.percentage),
      date: new Date(a.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      passed: a.passed,
    }));

    // Category accuracy
    const categoryStats: Record<string, { totalScore: number; count: number }> = {};
    attempts.forEach((a) => {
      if (!categoryStats[a.category]) {
        categoryStats[a.category] = { totalScore: 0, count: 0 };
      }
      categoryStats[a.category].totalScore += a.percentage;
      categoryStats[a.category].count += 1;
    });

    const categoryAccuracy: Record<string, number> = {};
    Object.keys(categoryStats).forEach((cat) => {
      categoryAccuracy[cat] = Math.round(categoryStats[cat].totalScore / categoryStats[cat].count);
    });

    return {
      quizzesTaken: totalTaken,
      averageScore: avgScore,
      bestScore: bestScore,
      passedCount: passedCount,
      rank: this.calculateStudentRank(userId),
      recentAttempts: attempts.slice(0, 5),
      trendData,
      categoryAccuracy,
    };
  }

  static calculateStudentRank(userId: string): number {
    const leaderboard = this.getLeaderboard();
    const rank = leaderboard.findIndex((u) => u.userId === userId);
    return rank !== -1 ? rank + 1 : leaderboard.length + 1;
  }

  static getLeaderboard(): LeaderboardUser[] {
    const users = this.getUsers().filter((u) => u.role === 'student');
    const attempts = this.getAttempts();

    const leaderboard: LeaderboardUser[] = users.map((user) => {
      const userAttempts = attempts.filter((a) => a.userId === user.id);
      if (userAttempts.length === 0) {
        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          quizzesTaken: 0,
          averagePercentage: 0,
          bestPercentage: 0,
          lastActive: user.joinedAt,
        };
      }

      const totalPercentage = userAttempts.reduce((sum, a) => sum + a.percentage, 0);
      const avgPercentage = Math.round((totalPercentage / userAttempts.length) * 10) / 10;
      const best = Math.max(...userAttempts.map((a) => a.percentage));
      const latestAttempt = userAttempts.sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )[0];

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        quizzesTaken: userAttempts.length,
        averagePercentage: avgPercentage,
        bestPercentage: best,
        lastActive: latestAttempt.completedAt,
      };
    });

    // Rank: higher average percentage first, then more quizzes taken
    leaderboard.sort((a, b) => {
      if (b.averagePercentage !== a.averagePercentage) {
        return b.averagePercentage - a.averagePercentage;
      }
      return b.quizzesTaken - a.quizzesTaken;
    });

    return leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }

  static getAdminStats() {
    const users = this.getUsers();
    const students = users.filter((u) => u.role === 'student');
    const quizzes = this.getQuizzes();
    const attempts = this.getAttempts();

    const totalStudents = students.length;
    const totalQuizzes = quizzes.length;
    const totalAttempts = attempts.length;

    const passCount = attempts.filter((a) => a.passed).length;
    const platformPassRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;
    const averageScore =
      totalAttempts > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts) : 0;

    // Per quiz performance
    const quizPerformance = quizzes.map((quiz) => {
      const qAttempts = attempts.filter((a) => a.quizId === quiz.id);
      const qPasses = qAttempts.filter((a) => a.passed).length;
      const qAvg =
        qAttempts.length > 0 ? Math.round(qAttempts.reduce((s, a) => s + a.percentage, 0) / qAttempts.length) : 0;
      const qPassRate = qAttempts.length > 0 ? Math.round((qPasses / qAttempts.length) * 100) : 0;
      return {
        quizId: quiz.id,
        title: quiz.title,
        category: quiz.category,
        totalAttempts: qAttempts.length,
        passRate: qPassRate,
        averageScore: qAvg,
      };
    });

    return {
      totalStudents,
      totalQuizzes,
      totalAttempts,
      platformPassRate,
      averageScore,
      quizPerformance,
      recentAttempts: attempts.slice(0, 10),
    };
  }

  // ================= CSV EXPORT UTILITY =================
  static exportAttemptsToCSV(): void {
    const attempts = this.getAttempts();
    if (attempts.length === 0) {
      alert('No quiz attempts found to export.');
      return;
    }

    const headers = [
      'Attempt ID',
      'Student Name',
      'Student Email',
      'Quiz Title',
      'Category',
      'Score',
      'Total Questions',
      'Percentage (%)',
      'Status',
      'Time Taken (seconds)',
      'Completed Date/Time (UTC)',
    ];

    const rows = attempts.map((a) => [
      a.id,
      `"${a.userName.replace(/"/g, '""')}"`,
      `"${a.userEmail.replace(/"/g, '""')}"`,
      `"${a.quizTitle.replace(/"/g, '""')}"`,
      `"${a.category.replace(/"/g, '""')}"`,
      a.score,
      a.totalQuestions,
      `${a.percentage}%`,
      a.passed ? 'PASSED' : 'FAILED',
      a.timeTakenSeconds,
      a.completedAt,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `QuizNova_Results_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
