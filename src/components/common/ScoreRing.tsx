import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  passed?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  passed = true,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  // Color selection based on passed status
  const ringColor = passed ? '#a3e635' : '#fb7185'; // Lime green if passed, warm rose if failed
  const glowShadow = passed ? 'rgba(163, 230, 53, 0.35)' : 'rgba(251, 113, 133, 0.35)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ccff00" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>
          <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-200 dark:text-neutral-800/80 fill-none"
        />

        {/* Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={passed ? 'url(#limeGradient)' : 'url(#roseGradient)'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="fill-none transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 10px ${glowShadow})`,
          }}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white tabular-nums">
          {Math.round(animatedScore)}%
        </span>
        <span
          className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${
            passed ? 'text-lime-600 dark:text-lime-400' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {passed ? 'Passed' : 'Needs Review'}
        </span>
      </div>
    </div>
  );
};
