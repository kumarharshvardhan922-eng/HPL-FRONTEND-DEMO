"use client";

import React from "react";

export interface StatComparisonRowProps {
  label: string;
  leftValue: number | string;
  rightValue: number | string;
  unit?: string;
  className?: string;
}

export const StatComparisonRow: React.FC<StatComparisonRowProps> = ({
  label,
  leftValue,
  rightValue,
  unit = "",
  className = "",
}) => {
  // Parse numeric values safely
  const parseNum = (v: number | string): number => {
    if (typeof v === "number") return isNaN(v) ? 0 : v;
    const cleaned = String(v).replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const numLeft = parseNum(leftValue);
  const numRight = parseNum(rightValue);
  const total = numLeft + numRight;

  let percentLeft = 50;
  if (total > 0) {
    percentLeft = Math.round((numLeft / total) * 100);
    // Clamp to [5, 95] for visibility when neither is zero, or [0, 100]
    if (numLeft > 0 && percentLeft < 5) percentLeft = 5;
    if (numRight > 0 && percentLeft > 95) percentLeft = 95;
  }

  const percentRight = 100 - percentLeft;

  return (
    <div className={`space-y-1.5 py-1 ${className}`}>
      {/* 3-column values and label */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-mono font-bold text-white text-left min-w-[40px]">
          {leftValue}
          {unit}
        </span>
        <span className="text-hpl-muted text-[11px] sm:text-xs font-medium text-center px-2 truncate">
          {label}
        </span>
        <span className="font-mono font-bold text-white text-right min-w-[40px]">
          {rightValue}
          {unit}
        </span>
      </div>

      {/* Two-segment proportional bar */}
      <div className="h-2 w-full bg-hpl-surface-2 rounded-full overflow-hidden flex border border-hpl-border/40">
        <div
          className="bg-hpl-accent/40 transition-all duration-300 rounded-l-full"
          style={{ width: `${percentLeft}%` }}
        />
        <div
          className="bg-hpl-accent transition-all duration-300 rounded-r-full shadow-glow"
          style={{ width: `${percentRight}%` }}
        />
      </div>
    </div>
  );
};
