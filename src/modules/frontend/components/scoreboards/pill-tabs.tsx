"use client";

import React, { useRef } from "react";

export interface PillTabItem {
  id: string;
  label: string;
}

export interface PillTabsProps {
  tabs: PillTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const PillTabs: React.FC<PillTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (index + 1) % tabs.length;
      onChange(tabs[nextIdx].id);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("button[role='tab']");
      buttons?.[nextIdx]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (index - 1 + tabs.length) % tabs.length;
      onChange(tabs[prevIdx].id);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("button[role='tab']");
      buttons?.[prevIdx]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Match Information Tabs"
      className={`flex items-center gap-1.5 p-1.5 bg-[rgba(11,26,40,0.78)] backdrop-blur-md rounded-full border border-hpl-border w-fit max-w-full overflow-x-auto no-scrollbar select-none ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-hpl-accent shrink-0 ${
              isSelected
                ? "bg-hpl-accent text-hpl-deep font-bold shadow-glow border border-hpl-accent"
                : "text-hpl-muted hover:text-white hover:bg-hpl-surface-2"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
