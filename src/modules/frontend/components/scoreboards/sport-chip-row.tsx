"use client";

import React from "react";
import { Sport, SportId } from "../../types";
import { HPL_SPORTS } from "../../config/sports";
import { Trophy, Activity, Zap, Target, Flame, Dribbble, LucideIcon } from "lucide-react";

const SPORT_ICONS: Record<string, LucideIcon> = {
  cricket: Trophy,
  football: Activity,
  kabaddi: Zap,
  badminton: Target,
  volleyball: Flame,
  basketball: Dribbble,
};

export interface SportChipRowProps {
  sports?: Sport[];
  selectedSportId: string;
  onSelectSport: (sportId: string) => void;
  includeAll?: boolean;
  allLabel?: string;
  className?: string;
}

export const SportChipRow: React.FC<SportChipRowProps> = ({
  sports = HPL_SPORTS,
  selectedSportId,
  onSelectSport,
  includeAll = false,
  allLabel = "All Sports",
  className = "",
}) => {
  return (
    <div
      role="tablist"
      aria-label="Sports"
      className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth select-none ${className}`}
    >
      {includeAll && (
        <button
          key="all"
          role="tab"
          aria-selected={selectedSportId === "all"}
          onClick={() => onSelectSport("all")}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-hpl-accent ${
            selectedSportId === "all"
              ? "bg-hpl-accent text-hpl-deep font-bold shadow-glow border border-hpl-accent"
              : "bg-[rgba(11,26,40,0.78)] text-hpl-muted hover:text-white hover:bg-hpl-surface-2 border border-hpl-border backdrop-blur-md"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{allLabel}</span>
        </button>
      )}

      {sports.map((sport) => {
        const isSelected = selectedSportId === sport.id;
        const IconComponent = SPORT_ICONS[sport.id] || Trophy;

        return (
          <button
            key={sport.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectSport(sport.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-hpl-accent ${
              isSelected
                ? "bg-hpl-accent text-hpl-deep font-bold shadow-glow border border-hpl-accent"
                : "bg-[rgba(11,26,40,0.78)] text-hpl-muted hover:text-white hover:bg-hpl-surface-2 border border-hpl-border backdrop-blur-md"
            }`}
          >
            <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{sport.name}</span>
          </button>
        );
      })}
    </div>
  );
};
