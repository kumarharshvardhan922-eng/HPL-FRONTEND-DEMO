"use client";

import React from "react";
import { Match, Team } from "../../types";
import { getMatchScoreDisplay } from "../../utils/match-display";
import { getInitials } from "../../utils/formatters";
import { Radio, MapPin } from "lucide-react";

export interface ScoreHeaderCardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  className?: string;
}

export const ScoreHeaderCard: React.FC<ScoreHeaderCardProps> = ({
  match,
  teamA,
  teamB,
  className = "",
}) => {
  const isLive = match.status === "live";
  const scoreInfo = getMatchScoreDisplay(match);

  const codeA = teamA?.shortName || getInitials(teamA?.name || match.teamAId);
  const codeB =
    match.teamBId === "bye"
      ? "BYE"
      : teamB?.shortName || getInitials(teamB?.name || match.teamBId);
  const nameA = teamA?.name || match.teamAId;
  const nameB = match.teamBId === "bye" ? "Scheduled Bye" : teamB?.name || match.teamBId;

  return (
    <div
      className={`w-full rounded-2xl bg-[rgba(11,26,40,0.78)] backdrop-blur-md border border-hpl-border p-5 sm:p-7 shadow-card relative overflow-hidden text-center ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-hpl-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-hpl-border/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Venue & Round/Week */}
      <div className="flex flex-col items-center justify-center gap-1 mb-6 relative z-10">
        <div className="flex items-center gap-1.5 text-xs text-white/90 font-semibold tracking-wide">
          <MapPin className="w-3.5 h-3.5 text-hpl-accent" />
          <span>{match.venue}</span>
        </div>
        <span className="text-[11px] font-medium text-hpl-muted uppercase tracking-wider">
          {match.round}
        </span>
      </div>

      {/* Main 3-Column Crest & Score Layout */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 relative z-10 max-w-xl mx-auto">
        {/* Team A (Home) */}
        <div className="flex flex-col items-center min-w-0">
          <div
            className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black text-base sm:text-xl text-white shadow-lg border-2 border-white/20 mb-2 sm:mb-3 shrink-0 select-none"
            style={{ backgroundColor: teamA?.primaryColor || "#38b6ff" }}
            aria-label={`${nameA} House Crest`}
          >
            {codeA}
          </div>
          <span className="text-sm sm:text-base font-bold text-white leading-tight truncate max-w-full font-display tracking-wide">
            {nameA}
          </span>
          <span className="text-[11px] text-hpl-muted font-medium mt-0.5">Home</span>
          {scoreInfo.subScoreA && (
            <span className="text-xs font-mono font-semibold text-hpl-accent-soft mt-1">
              {scoreInfo.subScoreA}
            </span>
          )}
        </div>

        {/* Center: Large Score & Status Pill */}
        <div className="flex flex-col items-center justify-center px-2 min-w-[100px] sm:min-w-[140px] shrink-0">
          <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-mono tracking-tight leading-none mb-3">
            {scoreInfo.scoreA} : {scoreInfo.scoreB}
          </div>

          {isLive ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hpl-live/20 border border-hpl-live/40 text-hpl-live text-xs font-bold font-mono">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{scoreInfo.minuteOrStatus || "LIVE"}</span>
            </div>
          ) : match.status === "completed" ? (
            <span className="px-3 py-1 rounded-full bg-hpl-surface-2 border border-hpl-border text-xs font-bold text-hpl-muted uppercase tracking-wider">
              Full Time
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-hpl-surface-2 border border-hpl-gold/40 text-xs font-bold font-mono text-hpl-gold">
              Upcoming
            </span>
          )}
        </div>

        {/* Team B (Away) */}
        <div className="flex flex-col items-center min-w-0">
          <div
            className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black text-base sm:text-xl text-white shadow-lg border-2 border-white/20 mb-2 sm:mb-3 shrink-0 select-none"
            style={{ backgroundColor: teamB?.primaryColor || "#a855f7" }}
            aria-label={`${nameB} House Crest`}
          >
            {codeB}
          </div>
          <span className="text-sm sm:text-base font-bold text-white leading-tight truncate max-w-full font-display tracking-wide">
            {nameB}
          </span>
          <span className="text-[11px] text-hpl-muted font-medium mt-0.5">Away</span>
          {scoreInfo.subScoreB && (
            <span className="text-xs font-mono font-semibold text-hpl-accent-soft mt-1">
              {scoreInfo.subScoreB}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
