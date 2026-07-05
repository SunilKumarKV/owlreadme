import React, { useState } from 'react';

interface DonutChartProps {
  data: { name: string; value: number; color?: string }[];
  size?: number;
  thickness?: number;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  thickness = 24,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        No data available
      </div>
    );
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Pre-calculate stroke offsets to prevent rendering mutations
  let accumulatedPercent = 0;
  const strokeOffsets = data.map((item) => {
    const percent = (item.value / total) * 100;
    const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
    accumulatedPercent += percent;
    return strokeOffset;
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
      {/* SVG Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Base track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(156, 163, 175, 0.1)"
            strokeWidth={thickness}
          />
          {data.map((item, index) => {
            const percent = (item.value / total) * 100;
            const strokeLength = (percent / 100) * circumference;
            const strokeOffset = strokeOffsets[index];

            const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            const isHovered = activeIndex === index;

            return (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  transformOrigin: 'center',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                }}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {activeIndex !== null ? (
            <>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                {data[activeIndex].name}
              </span>
              <span className="text-2xl font-bold text-black dark:text-white mt-0.5">
                {((data[activeIndex].value / total) * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-gray-400">
                {data[activeIndex].value} items
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                Total
              </span>
              <span className="text-3xl font-extrabold text-black dark:text-white mt-0.5">
                {total}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-2 gap-2 text-xs w-full max-w-xs">
        {data.map((item, index) => {
          const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
          const isHovered = activeIndex === index;
          return (
            <div
              key={item.name}
              className={`flex items-center gap-2 p-1.5 rounded transition ${
                isHovered ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
                {item.name}
              </span>
              <span className="text-gray-400 font-semibold shrink-0">
                {item.value} ({((item.value / total) * 100).toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;
