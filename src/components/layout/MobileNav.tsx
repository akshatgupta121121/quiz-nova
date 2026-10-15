import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, TrendingUp, Trophy, ShieldCheck } from 'lucide-react';
import { NavigationTab } from '../../types';

interface MobileNavProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onNavigate }) => {
  const { isAdmin } = useAuth();

  const tabs = [
    { id: 'dashboard' as NavigationTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'quizzes' as NavigationTab, label: 'Quizzes', icon: BookOpen },
    { id: 'performance' as NavigationTab, label: 'Stats', icon: TrendingUp },
    { id: 'leaderboard' as NavigationTab, label: 'Rankings', icon: Trophy },
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin-dashboard' as NavigationTab, label: 'Admin', icon: ShieldCheck });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 border-t border-neutral-800 px-2 py-1.5 flex items-center justify-around text-white">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-lime-400 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-lime-400' : 'text-neutral-400'}`} />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
