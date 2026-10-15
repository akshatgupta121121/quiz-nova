import React, { useMemo } from 'react';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Award, Medal, Sparkles, User as UserIcon } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || '';

  const leaderboard = useMemo(() => {
    return StorageService.getLeaderboard();
  }, []);

  const currentUserEntry = leaderboard.find((u) => u.userId === currentUserId);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
          Class Leaderboard
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Top Java candidates ranked by overall assessment accuracy and verified test completions.
        </p>
      </div>

      {/* Current User Spotlight Card */}
      {currentUserEntry && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 border border-neutral-800 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-lime-400 text-neutral-950 flex items-center justify-center font-display font-bold text-lg shadow-md shadow-lime-400/20">
              #{currentUserEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{currentUserEntry.name}</h3>
                <span className="text-[10px] font-semibold text-lime-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20">
                  You
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {currentUserEntry.quizzesTaken} quizzes completed · Best score {currentUserEntry.bestPercentage}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-[11px] text-neutral-400 block">Average Accuracy</span>
              <span className="text-2xl font-bold font-display text-lime-400 tabular-nums">
                {currentUserEntry.averagePercentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium (Desktop) */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Silver (#2) */}
          <div className="order-2 sm:order-1 p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 text-center flex flex-col items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
              <Medal className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rank #2</span>
            <h4 className="mt-1 text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[160px]">
              {leaderboard[1].name}
            </h4>
            <div className="mt-3 text-2xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
              {leaderboard[1].averagePercentage}%
            </div>
            <span className="text-[11px] text-neutral-400 mt-1">
              {leaderboard[1].quizzesTaken} quizzes taken
            </span>
          </div>

          {/* Gold (#1) */}
          <div className="order-1 sm:order-2 p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-500/5 bg-white dark:bg-[#111322] border-2 border-amber-500/40 text-center flex flex-col items-center justify-between shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider">
              Champion #1
            </span>
            <h4 className="mt-1 text-base font-bold text-neutral-900 dark:text-white truncate max-w-[180px]">
              {leaderboard[0].name}
            </h4>
            <div className="mt-3 text-3xl font-extrabold font-display text-amber-500 tabular-nums">
              {leaderboard[0].averagePercentage}%
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              {leaderboard[0].quizzesTaken} quizzes taken · Best: {leaderboard[0].bestPercentage}%
            </span>
          </div>

          {/* Bronze (#3) */}
          <div className="order-3 sm:order-3 p-5 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 text-center flex flex-col items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-amber-700/20 flex items-center justify-center text-amber-700 mb-2">
              <Award className="w-5 h-5 text-amber-700 dark:text-amber-600" />
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-600 uppercase tracking-wider">
              Rank #3
            </span>
            <h4 className="mt-1 text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[160px]">
              {leaderboard[2].name}
            </h4>
            <div className="mt-3 text-2xl font-bold font-display text-neutral-900 dark:text-white tabular-nums">
              {leaderboard[2].averagePercentage}%
            </div>
            <span className="text-[11px] text-neutral-400 mt-1">
              {leaderboard[2].quizzesTaken} quizzes taken
            </span>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111322] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
        <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white mb-4">
          All Candidate Standings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <th className="pb-3 w-16 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Candidate</th>
                <th className="pb-3 font-semibold">Quizzes Taken</th>
                <th className="pb-3 font-semibold">Best Score</th>
                <th className="pb-3 font-semibold text-right">Average Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {leaderboard.map((student) => {
                const isCurrent = student.userId === currentUserId;
                return (
                  <tr
                    key={student.userId}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-lime-400/10 dark:bg-lime-400/5 font-semibold'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
                    }`}
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 font-display font-bold tabular-nums">
                        {student.rank === 1 ? (
                          <span className="text-amber-500 flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" /> 1
                          </span>
                        ) : student.rank === 2 ? (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Medal className="w-3.5 h-3.5" /> 2
                          </span>
                        ) : student.rank === 3 ? (
                          <span className="text-amber-700 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> 3
                          </span>
                        ) : (
                          <span className="text-neutral-500 pl-4">{student.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs uppercase text-neutral-700 dark:text-neutral-300">
                          {student.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-900 dark:text-white">{student.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold text-lime-500 uppercase px-1.5 py-0.2 rounded bg-lime-500/10">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-neutral-600 dark:text-neutral-400 font-mono-code tabular-nums">
                      {student.quizzesTaken}
                    </td>
                    <td className="py-3.5 font-mono-code tabular-nums text-neutral-800 dark:text-neutral-200">
                      {student.bestPercentage}%
                    </td>
                    <td className="py-3.5 text-right font-display font-bold text-neutral-900 dark:text-white tabular-nums text-sm">
                      {student.averagePercentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
