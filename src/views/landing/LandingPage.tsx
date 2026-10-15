import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Code2,
  Database,
  Globe,
  Clock,
  TrendingUp,
  Award,
  Sun,
  Moon,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreQuizzes: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreQuizzes,
  onOpenAuth,
}) => {
  const { loginAsDemoStudent, loginAsDemoAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0d19] text-neutral-900 dark:text-neutral-100 font-sans transition-colors">
      {/* Top Bar following 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-[#0c0d19]/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark single element */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-lime-400 font-bold font-display text-lg shadow-sm">
            Q
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
            QuizNova
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
            Features
          </a>
          <a href="#syllabus" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
            Syllabus
          </a>
          <a href="#how-it-works" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
            How It Works
          </a>
          <a href="#demo" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
            Platform Demo
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={onOpenAuth}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            Sign In
          </button>

          <button
            onClick={onGetStarted}
            className="px-4 py-2 text-xs font-bold bg-lime-400 hover:bg-lime-300 text-neutral-950 rounded-xl transition-all shadow-sm shadow-lime-400/20 whitespace-nowrap"
          >
            Launch System
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 dark:bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[200px] bg-lime-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-lime-500" />
            <span>Built for Java Engineers & Technical Interview Readiness</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-neutral-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
            Master Java Architecture with <span className="text-lime-500 dark:text-lime-400">Timed Benchmarks</span> & Precision Analytics
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            QuizNova replaces generic trivia with verified JVM puzzles, live countdown timers, detailed memory breakdown explanations, and institutional cohort management.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                loginAsDemoStudent();
                onGetStarted();
              }}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-lg shadow-lime-400/25 flex items-center gap-2 active:scale-[0.98]"
            >
              <span>Start Free Student Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                loginAsDemoAdmin();
                onGetStarted();
              }}
              className="px-5 py-3.5 rounded-xl text-sm font-semibold border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Explore Admin Console</span>
            </button>
          </div>

          {/* Social Proof metrics */}
          <div className="mt-12 pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 dark:text-white tabular-nums">
                5 Units
              </span>
              <p className="text-xs text-neutral-500 mt-0.5">Core Java to Servlets</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 dark:text-white tabular-nums">
                40 Questions
              </span>
              <p className="text-xs text-neutral-500 mt-0.5">Verified code problems</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 dark:text-white tabular-nums">
                100% Real
              </span>
              <p className="text-xs text-neutral-500 mt-0.5">Persistent database DAO</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 dark:text-white tabular-nums">
                CSV Export
              </span>
              <p className="text-xs text-neutral-500 mt-0.5">Automated cohort audits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800/80">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold text-lime-600 dark:text-lime-400 font-mono-code uppercase tracking-wider">
            Enterprise Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 dark:text-white mt-2">
            Engineered for Academic Rigor & Developer Precision
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Every feature mirrors a high-stakes exam environment with anti-cheat timers, answer reviews, and longitudinal growth metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Timed Exam Environment
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Auto-submitting live countdown clock with amber warnings when time runs low. Includes a question palette grid for quick navigation and review flags.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Precision Trajectory Analytics
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Longitudinal trendline charts and category radar bars identify specific strengths (e.g. Collections) and diagnosing gaps (e.g. JDBC transactions).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Institutional Admin Controls
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Staff dashboard to create quizzes, edit code-heavy MCQ problems, view student pass matrix yields, and download CSV audit sheets for offline grading.
            </p>
          </div>
        </div>
      </section>

      {/* Syllabus Topics Section */}
      <section id="syllabus" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono-code uppercase tracking-wider">
              Curated Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 dark:text-white mt-2">
              Comprehensive Java & JEE Assessment Suite
            </h2>
          </div>
          <button
            onClick={onExploreQuizzes}
            className="text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All 5 Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Core Java',
              icon: Cpu,
              difficulty: 'Beginner',
              desc: 'Stack vs Heap, Immutability, Garbage Collection, and Operators.',
            },
            {
              title: 'OOP Concepts',
              icon: Layers,
              difficulty: 'Intermediate',
              desc: 'Dynamic dispatch, Record classes, Interfaces, and Abstract types.',
            },
            {
              title: 'Collections',
              icon: Code2,
              difficulty: 'Intermediate',
              desc: 'HashMap collisions, Red-Black trees, and ConcurrentHashMap.',
            },
            {
              title: 'JDBC Access',
              icon: Database,
              difficulty: 'Advanced',
              desc: 'PreparedStatement, Transactions, Connection pooling, and MetaData.',
            },
            {
              title: 'Servlets & JSP',
              icon: Globe,
              difficulty: 'Advanced',
              desc: 'Servlet lifecycle, Filters, Sessions, and Dispatcher mechanics.',
            },
          ].map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {topic.title}
                  </h4>
                  <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-neutral-400">
                  {topic.difficulty}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-lime-600 dark:text-lime-400 font-mono-code uppercase tracking-wider">
            Workflow Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 dark:text-white mt-2">
            How QuizNova Powers Mastery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-lime-400 dark:bg-neutral-800 font-display font-bold text-lg flex items-center justify-center mb-4 shadow-md">
              01
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">
              Select Assessment Module
            </h4>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 max-w-xs leading-relaxed">
              Choose from Core Java, OOP, Collections, JDBC, or Servlets according to your study roadmap.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-lime-400 dark:bg-neutral-800 font-display font-bold text-lg flex items-center justify-center mb-4 shadow-md">
              02
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">
              Complete Timed Exam
            </h4>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 max-w-xs leading-relaxed">
              Navigate code problems with real-time countdown, review toggles, and clear option markers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-lime-400 dark:bg-neutral-800 font-display font-bold text-lg flex items-center justify-center mb-4 shadow-md">
              03
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">
              Analyze & Track Progress
            </h4>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 max-w-xs leading-relaxed">
              Receive animated score metrics, in-depth JVM explanations, and watch your leaderboard rank climb.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section / Quick Entry */}
      <section id="demo" className="py-16 px-6 lg:px-12 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Ready to verify your Java engineering skills?
            </h2>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
              Begin immediately with our seeded student account or log in as an administrator to explore question authoring and CSV exports.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  loginAsDemoStudent();
                  onGetStarted();
                }}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-md shadow-lime-400/20"
              >
                Log In as Demo Student
              </button>
              <button
                onClick={() => {
                  loginAsDemoAdmin();
                  onGetStarted();
                }}
                className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                Log In as Instructor Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10 px-6 lg:px-12 text-xs text-neutral-500 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-lime-400 font-bold font-display text-xs">
            Q
          </div>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">QuizNova</span>
          <span>·</span>
          <span>Online Quiz & Performance Management System</span>
        </div>

        <div className="flex items-center gap-6">
          <span>Relational Schema Architecture</span>
          <span>Java & JDBC Compatible</span>
          <span>© 2026 QuizNova</span>
        </div>
      </footer>
    </div>
  );
};
