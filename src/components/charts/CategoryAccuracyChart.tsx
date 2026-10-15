import React from 'react';
import { Layers, Database, Globe, Code2, Cpu } from 'lucide-react';

interface CategoryAccuracyChartProps {
  categoryAccuracy: Record<string, number>;
}

export const CategoryAccuracyChart: React.FC<CategoryAccuracyChartProps> = ({
  categoryAccuracy,
}) => {
  const categories = [
    { name: 'Core Java', icon: Cpu, color: 'from-indigo-500 to-indigo-400' },
    { name: 'OOP Concepts', icon: Layers, color: 'from-violet-500 to-purple-400' },
    { name: 'Collections Framework', icon: Code2, color: 'from-sky-500 to-teal-400' },
    { name: 'JDBC', icon: Database, color: 'from-amber-500 to-yellow-400' },
    { name: 'Servlets & JSP', icon: Globe, color: 'from-lime-500 to-emerald-400' },
  ];

  const hasData = Object.keys(categoryAccuracy).length > 0;

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const score = categoryAccuracy[cat.name] ?? (hasData ? 0 : 0);
        const Icon = cat.icon;
        const isMastered = score >= 75;

        return (
          <div key={cat.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                <Icon className="w-3.5 h-3.5 text-neutral-400" />
                <span>{cat.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-semibold tabular-nums text-neutral-900 dark:text-white">
                  {score > 0 ? `${score}%` : 'Not attempted'}
                </span>
                {score > 0 && (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      isMastered
                        ? 'bg-lime-500/10 text-lime-600 dark:text-lime-400'
                        : 'bg-neutral-500/10 text-neutral-500'
                    }`}
                  >
                    {isMastered ? 'Proficient' : 'In Progress'}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Track */}
            <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-800/80 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${cat.color}`}
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
