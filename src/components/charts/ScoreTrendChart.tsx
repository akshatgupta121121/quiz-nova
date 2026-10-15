import React, { useState } from 'react';

interface TrendPoint {
  attemptIndex: number;
  quizTitle: string;
  percentage: number;
  date: string;
  passed: boolean;
}

interface ScoreTrendChartProps {
  data: TrendPoint[];
  height?: number;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ data, height = 240 }) => {
  const [activePoint, setActivePoint] = useState<TrendPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-8 text-center text-neutral-500"
        style={{ height }}
      >
        <p className="text-sm font-medium">No quiz attempts recorded yet.</p>
        <p className="text-xs text-neutral-400 mt-1">Take your first quiz to see your score trajectory!</p>
      </div>
    );
  }

  const width = 650;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Single point case
  const points = data.map((d, index) => {
    const x =
      data.length === 1
        ? padding.left + graphWidth / 2
        : padding.left + (index / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.percentage / 100) * graphHeight;
    return { ...d, x, y };
  });

  // Generate smooth SVG curve
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`;
  } else {
    pathD = points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
    }, '');
  }

  // Area fill below line
  let areaD = '';
  if (points.length > 1) {
    const first = points[0];
    const last = points[points.length - 1];
    const bottomY = padding.top + graphHeight;
    areaD = `${pathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }

  // Pass mark reference line at 70%
  const passY = padding.top + graphHeight - (70 / 100) * graphHeight;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Tooltip */}
      {activePoint && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-2 rounded-lg bg-neutral-900/95 dark:bg-neutral-950 text-white border border-neutral-700 shadow-xl text-xs backdrop-blur-md transition-all duration-150"
          style={{
            left: `${points.find((p) => p.attemptIndex === activePoint.attemptIndex)?.x || 0}px`,
            top: `${(points.find((p) => p.attemptIndex === activePoint.attemptIndex)?.y || 0) - 10}px`,
          }}
        >
          <div className="font-semibold text-lime-400 font-display">{activePoint.percentage}%</div>
          <div className="text-neutral-300 font-medium truncate max-w-[180px]">{activePoint.quizTitle}</div>
          <div className="text-neutral-400 text-[10px] mt-0.5">{activePoint.date}</div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="scoreLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a3e635" />
          </linearGradient>
        </defs>

        {/* Y Axis Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padding.top + graphHeight - (val / 100) * graphHeight;
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                strokeDasharray="4 4"
                className="text-neutral-200 dark:text-neutral-800/70"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] fill-neutral-400 dark:fill-neutral-500 font-mono-code tabular-nums"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* 70% Benchmark Line */}
        <line
          x1={padding.left}
          y1={passY}
          x2={width - padding.right}
          y2={passY}
          stroke="#f59e0b"
          strokeDasharray="2 3"
          strokeOpacity="0.6"
        />
        <text
          x={width - padding.right}
          y={passY - 4}
          textAnchor="end"
          className="text-[9px] fill-amber-500/80 font-medium"
        >
          Pass Target (70%)
        </text>

        {/* Area fill */}
        {areaD && <path d={areaD} fill="url(#scoreAreaGradient)" />}

        {/* Trendline */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#scoreLineGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p) => {
          const isSelected = activePoint?.attemptIndex === p.attemptIndex;
          return (
            <g
              key={p.attemptIndex}
              className="cursor-pointer transition-transform"
              onMouseEnter={() => setActivePoint(p)}
              onMouseLeave={() => setActivePoint(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={isSelected ? 8 : 5}
                className={`transition-all duration-150 ${
                  p.passed
                    ? 'fill-lime-400 stroke-neutral-900 dark:stroke-neutral-950'
                    : 'fill-rose-400 stroke-neutral-900 dark:stroke-neutral-950'
                }`}
                strokeWidth="2.5"
              />
              {/* X label */}
              <text
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                className="text-[10px] fill-neutral-400 dark:fill-neutral-500 font-medium"
              >
                {p.date}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
