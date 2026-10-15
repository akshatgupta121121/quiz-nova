import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, ShieldCheck, GraduationCap, ChevronDown, Sparkles, FileCode } from 'lucide-react';
import { NavigationTab } from '../../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenAuth?: () => void;
  onOpenBackendCode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAuth, onOpenBackendCode }) => {
  const { user, logout, isAdmin, loginAsDemoAdmin, loginAsDemoStudent } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getBreadcrumbTitle = (tab: NavigationTab): string => {
    switch (tab) {
      case 'dashboard':
        return 'Student Portal / Overview';
      case 'quizzes':
        return 'Student Portal / Quiz Catalog';
      case 'performance':
        return 'Student Portal / My Performance Analytics';
      case 'leaderboard':
        return 'Student Portal / Class Leaderboard';
      case 'admin-dashboard':
        return 'Admin Console / Metrics & Overview';
      case 'admin-quizzes':
        return 'Admin Console / Quiz Management';
      case 'admin-questions':
        return 'Admin Console / Question Bank Editor';
      case 'admin-results':
        return 'Admin Console / Student Results & CSV Export';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-[#0c0d19]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Zone 1: Contextual Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2 mr-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-lime-400 font-bold font-display text-base shadow-sm">
            Q
          </div>
          <span className="font-display font-bold text-neutral-900 dark:text-white tracking-tight">QuizNova</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span className="truncate max-w-[280px] lg:max-w-md">{getBreadcrumbTitle(currentTab)}</span>
        </div>
      </div>

      {/* Zone 2 / 3: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Java Backend Code trigger */}
        {onOpenBackendCode && (
          <button
            onClick={onOpenBackendCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors shadow-sm"
            title="Inspect generated Java 17 / Jakarta EE Backend Project"
          >
            <FileCode className="w-3.5 h-3.5 text-lime-500" />
            <span className="hidden sm:inline">Java Backend</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-lime-500 text-white font-bold text-xs flex items-center justify-center uppercase shadow-inner">
                {user.name.slice(0, 2)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono-code">
                  {user.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121424] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/70">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                      {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                      {user.role}
                    </div>
                  </div>

                  {/* Role Switcher for seamless testing */}
                  <div className="py-1">
                    <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Switch Role Mode
                    </p>
                    {isAdmin ? (
                      <button
                        onClick={() => {
                          loginAsDemoStudent();
                          onNavigate('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-lime-500" />
                        Switch to Student View
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          loginAsDemoAdmin();
                          onNavigate('admin-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        Switch to Instructor Admin
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-neutral-100 dark:border-neutral-800/70">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => loginAsDemoStudent()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              Demo Student
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-lime-400 hover:bg-lime-300 rounded-xl transition-all shadow-sm shadow-lime-400/20"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
