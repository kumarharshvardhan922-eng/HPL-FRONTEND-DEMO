"use client";

import React from "react";
import Link from "next/link";
import { Match, Team } from "../../types";
import { getMatchScoreDisplay } from "../../utils/match-display";
import { getInitials } from "../../utils/formatters";
import { Radio } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export interface LiveMatchCarouselProps {
  matches: Match[];
  teamsMap: Record<string, Team>;
  isLoading?: boolean;
  className?: string;
}

export const LiveMatchCarousel: React.FC<LiveMatchCarouselProps> = ({
  matches,
  teamsMap,
  isLoading = false,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`flex gap-4 overflow-x-auto no-scrollbar pb-3 px-1 ${className}`}>
        <Skeleton className="w-[85vw] max-w-[340px] sm:max-w-[380px] h-48 rounded-2xl shrink-0" />
        <Skeleton className="w-[85vw] max-w-[340px] sm:max-w-[380px] h-48 rounded-2xl shrink-0" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={`p-8 rounded-2xl bg-[rgba(11,26,40,0.78)] backdrop-blur-md border border-hpl-border text-center text-hpl-muted text-sm shadow-card ${className}`}>
        No live matches right now. Check upcoming fixtures.
      </div>
    );
  }

  return (
    <div
      className={`flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-3 px-1 ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
      aria-label="Live Matches Carousel"
    >
      {matches.map((match) => {
        const teamA = teamsMap[match.teamAId];
        const teamB = teamsMap[match.teamBId];
        const codeA = teamA?.shortName || getInitials(teamA?.name || match.teamAId);
        const codeB =
          match.teamBId === "bye"
            ? "BYE"
            : teamB?.shortName || getInitials(teamB?.name || match.teamBId);
        const nameA = teamA?.name || match.teamAId;
        const nameB = match.teamBId === "bye" ? "Scheduled Bye" : teamB?.name || match.teamBId;

        const scoreInfo = getMatchScoreDisplay(match);

        return (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="w-[85vw] max-w-[340px] sm:max-w-[380px] shrink-0 snap-center rounded-2xl bg-[rgba(11,26,40,0.78)] backdrop-blur-md border border-hpl-border p-4 sm:p-5 shadow-card hover:border-hpl-accent/50 hover:shadow-glow/20 transition-all duration-150 relative overflow-hidden group select-none block focus:outline-none focus:ring-2 focus:ring-hpl-accent"
          >
            {/* Ambient soft glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-hpl-accent/15 rounded-full blur-2xl pointer-events-none group-hover:bg-hpl-accent/25 transition-all duration-300" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-hpl-border/30 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Sport + Round & LIVE badge */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-hpl-border/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-hpl-accent">
                  {match.sportId}
                </span>
                <span className="text-hpl-border">•</span>
                <span className="text-xs text-hpl-muted truncate max-w-[140px]">
                  {match.round}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-hpl-live/15 border border-hpl-live/30 text-hpl-live text-[10px] font-bold">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>

            {/* 3-Column Grid for Score & Teams (never overlaps) */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 my-2">
              {/* Team A (Home) */}
              <div className="flex flex-col items-center text-center min-w-0">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-md border border-white/20 mb-2 shrink-0 select-none"
                  style={{ backgroundColor: teamA?.primaryColor || "#38b6ff" }}
                >
                  {codeA}
                </div>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight truncate max-w-full">
                  {nameA}
                </span>
                <span className="text-[10px] text-hpl-muted font-medium mt-0.5">Home</span>
              </div>

              {/* Center Score & Minute Pill */}
              <div className="flex flex-col items-center justify-center px-1 text-center shrink-0 min-w-[70px] sm:min-w-[80px]">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-none mb-2">
                  {scoreInfo.scoreA} : {scoreInfo.scoreB}
                </div>
                {scoreInfo.minuteOrStatus && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-hpl-surface-2 border border-hpl-accent/30 text-[10px] font-mono font-bold text-hpl-gold">
                    {scoreInfo.minuteOrStatus}
                  </span>
                )}
              </div>

              {/* Team B (Away) */}
              <div className="flex flex-col items-center text-center min-w-0">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-md border border-white/20 mb-2 shrink-0 select-none"
                  style={{ backgroundColor: teamB?.primaryColor || "#a855f7" }}
                >
                  {codeB}
                </div>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight truncate max-w-full">
                  {nameB}
                </span>
                <span className="text-[10px] text-hpl-muted font-medium mt-0.5">Away</span>
              </div>
            </div>

            {/* Venue Footer */}
            <div className="mt-3 pt-2.5 border-t border-hpl-border/50 flex items-center justify-between text-[11px] text-hpl-muted">
              <span className="truncate max-w-[200px]">{match.venue}</span>
              <span className="text-hpl-accent group-hover:translate-x-0.5 transition-transform duration-150 font-bold">
                Details →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
