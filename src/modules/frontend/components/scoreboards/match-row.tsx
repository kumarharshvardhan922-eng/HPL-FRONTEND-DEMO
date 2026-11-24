"use client";

import React from "react";
import Link from "next/link";
import { Match, Team } from "../../types";
import { getMatchScoreDisplay } from "../../utils/match-display";
import { formatTimeOnly, formatDateTime, getInitials } from "../../utils/formatters";
import { Radio } from "lucide-react";

export interface MatchRowProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  className?: string;
}

export const MatchRow: React.FC<MatchRowProps> = ({
  match,
  teamA,
  teamB,
  className = "",
}) => {
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const scoreInfo = getMatchScoreDisplay(match);

  const codeA = teamA?.shortName || getInitials(teamA?.name || match.teamAId);
  const codeB =
    match.teamBId === "bye"
      ? "BYE"
      : teamB?.shortName || getInitials(teamB?.name || match.teamBId);
  const nameA = teamA?.name || match.teamAId;
  const nameB = match.teamBId === "bye" ? "Scheduled Bye" : teamB?.name || match.teamBId;

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`block w-full rounded-2xl bg-[rgba(11,26,40,0.78)] backdrop-blur-md border border-hpl-border p-3 sm:p-4 hover:border-hpl-accent/50 hover:bg-hpl-surface-2/80 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-hpl-accent group select-none ${className}`}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        {/* Left Team (Home) */}
        <div className="flex items-center justify-end gap-2.5 min-w-0 text-right">
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-full group-hover:text-hpl-accent-soft transition-colors">
            {nameA}
          </span>
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm border border-white/20 select-none"
            style={{ backgroundColor: teamA?.primaryColor || "#38b6ff" }}
            aria-label={`${nameA} badge`}
          >
            {codeA}
          </div>
        </div>

        {/* Center: Live / Completed / Upcoming info */}
        <div className="flex flex-col items-center justify-center min-w-[76px] sm:min-w-[96px] px-1 text-center shrink-0">
          {isLive ? (
            <>
              <div className="text-sm sm:text-base font-black font-mono text-white tracking-tight leading-none mb-1">
                {scoreInfo.scoreA} : {scoreInfo.scoreB}
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-hpl-live/15 border border-hpl-live/30 text-hpl-live text-[9px] sm:text-[10px] font-bold">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>{scoreInfo.minuteOrStatus || "LIVE"}</span>
              </div>
            </>
          ) : isCompleted ? (
            <>
              <div className="text-xs sm:text-sm font-black font-mono text-white tracking-tight leading-none mb-1">
                {scoreInfo.scoreA} : {scoreInfo.scoreB}
              </div>
              <span className="text-[10px] font-bold text-hpl-muted uppercase tracking-wider">
                FT
              </span>
            </>
          ) : (
            <>
              <span className="text-xs sm:text-sm font-mono font-bold text-hpl-gold tracking-tight leading-none mb-0.5">
                {formatTimeOnly(match.startTime)}
              </span>
              <span className="text-[10px] text-hpl-muted truncate max-w-[85px]">
                {new Date(match.startTime).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </>
          )}
        </div>

        {/* Right Team (Away) */}
        <div className="flex items-center justify-start gap-2.5 min-w-0 text-left">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm border border-white/20 select-none"
            style={{ backgroundColor: teamB?.primaryColor || "#a855f7" }}
            aria-label={`${nameB} badge`}
          >
            {codeB}
          </div>
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-full group-hover:text-hpl-accent-soft transition-colors">
            {nameB}
          </span>
        </div>
      </div>
    </Link>
  );
};
