"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "pill",
  className,
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center overflow-x-auto no-scrollbar gap-1.5 p-1",
        variant === "pill" ? "bg-hpl-surface-2 p-1.5 rounded-2xl border border-hpl-border" : "border-b border-hpl-border gap-4",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-semibold transition-all duration-150 rounded-xl px-3.5 py-2 select-none",
              variant === "pill"
                ? isActive
                  ? "bg-hpl-accent text-hpl-deep font-bold shadow-glow"
                  : "text-hpl-muted hover:text-white hover:bg-hpl-surface"
                : isActive
                ? "text-hpl-accent border-b-2 border-hpl-accent font-bold rounded-none pb-2.5"
                : "text-hpl-muted hover:text-white rounded-none pb-2.5"
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isActive ? "bg-hpl-deep text-white" : "bg-hpl-surface text-hpl-muted border border-hpl-border"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
