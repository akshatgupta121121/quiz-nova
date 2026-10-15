import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Trophy,
  BarChart3,
  FolderKanban,
  FileQuestion,
  Users,
  RotateCcw,
  Sparkles,
  Zap,
  FileCode,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenBackendCode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, onOpenBackendCode }) => {
  const { user, isAdmin, loginAsDemoAdmin, loginAsDemoStudent } = useAuth();
  const { showToast } = useToast();

  const handleResetData = () => {
    if (window.confirm('Reset all QuizNova data to seed defaults? Any new attempts or custom quizzes will be restored to seed values.')) {
      StorageService.resetToSeed();
      showToast('Database reset to fresh seed data!', 'success');
      // trigger page refresh or event
      window.location.reload();
    }
  };

  const studentLinks = [
    { id: 'dashboard' as NavigationTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'quizzes' as NavigationTab, label: 'Quiz Library', icon: BookOpen },
    { id: 'performance' as NavigationTab, label: 'My Performance', icon: TrendingUp },
    { id: 'leaderboard' as NavigationTab, label: 'Leaderboard', icon: Trophy },
  ];

  const adminLinks = [
    { id: 'admin-dashboard' as NavigationTab, label: 'Admin Analytics', icon: BarChart3 },
    { id: 'admin-quizzes' as NavigationTab, label: 'Manage Quizzes', icon: FolderKanban },
    { id: 'admin-questions' as NavigationTab, label: 'Question Bank', icon: FileQuestion },
    { id: 'admin-results' as NavigationTab, label: 'Results & CSV', icon: Users },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-neutral-900 border-r border-neutral-800 text-white select-none shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-neutral-800/80">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-lime-400 font-bold font-display text-lg shadow-md shadow-indigo-950/40">
          Q
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-base tracking-tight text-white">QuizNova</span>
            <span className="text-[10px] font-semibold text-lime-400 font-mono-code uppercase px-1 py-0.5 rounded bg-lime-400/10">
              Java
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 block -mt-0.5">Assessment Engine</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {/* Student Section */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono-code">
            Student Space
          </p>
          <nav className="space-y-1">
            {studentLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-neutral-800 text-lime-400 shadow-sm border border-neutral-700/60'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-lime-400' : 'text-neutral-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-lime-400 shadow-sm shadow-lime-400/50" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono-code">
              Instructor Admin
            </p>
            {!isAdmin && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                Staff
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isAdmin) {
                      // Switch automatically to admin for friction-free review
                      loginAsDemoAdmin();
                    }
                    onNavigate(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/80'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-neutral-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="pt-2 border-t border-neutral-800/60">
          <p className="px-3 mb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-mono-code">
            Quick Persona Switch
          </p>
          <div className="grid grid-cols-2 gap-1.5 px-1">
            <button
              onClick={() => {
                loginAsDemoStudent();
                onNavigate('dashboard');
              }}
              className={`p-2 rounded-lg text-[11px] font-medium border text-center transition-colors ${
                !isAdmin && user
                  ? 'bg-neutral-800 border-lime-400/40 text-lime-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Student (Alex)
            </button>
            <button
              onClick={() => {
                loginAsDemoAdmin();
                onNavigate('admin-dashboard');
              }}
              className={`p-2 rounded-lg text-[11px] font-medium border text-center transition-colors ${
                isAdmin
                  ? 'bg-neutral-800 border-indigo-400/40 text-indigo-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Admin (Prof.)
            </button>
          </div>
        </div>
      </div>

      {/* Footer System Strip */}
      <div className="p-4 border-t border-neutral-800/80 space-y-2">
        {onOpenBackendCode && (
          <button
            onClick={onOpenBackendCode}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 text-xs font-semibold border border-lime-400/30 transition-colors"
            title="Inspect generated Java 17 / Jakarta EE Backend Project"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Java 17 Backend Code</span>
          </button>
        )}

        <button
          onClick={handleResetData}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 text-xs font-medium border border-neutral-800/80 transition-colors"
          title="Restore seed data in localStorage"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 pt-1">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-lime-400" />
            Java 21 Ready
          </span>
          <span className="font-mono-code">v2.4</span>
        </div>
      </div>
    </aside>
  );
};
