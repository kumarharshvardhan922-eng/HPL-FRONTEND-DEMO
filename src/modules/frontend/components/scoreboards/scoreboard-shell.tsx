import React from "react";
import { Match, Team } from "../../types";
import { Badge } from "../ui/badge";
import { MapPin, User, Clock, Radio } from "lucide-react";
import { formatDateTime, getInitials } from "../../utils/formatters";

export interface ScoreboardShellProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  scoreDisplayA: string | React.ReactNode;
  scoreDisplayB: string | React.ReactNode;
  subScoreA?: string | React.ReactNode;
  subScoreB?: string | React.ReactNode;
  matchTimerOrStatus?: string;
  children?: React.ReactNode;
}

export const ScoreboardShell: React.FC<ScoreboardShellProps> = ({
  match,
  teamA,
  teamB,
  scoreDisplayA,
  scoreDisplayB,
  subScoreA,
  subScoreB,
  matchTimerOrStatus,
  children,
}) => {
  const isLive = match.status === "live";
  const codeA = teamA?.shortName || getInitials(teamA?.name || match.teamAId || "HA");
  const codeB = match.teamBId === "bye" ? "BYE" : teamB?.shortName || getInitials(teamB?.name || match.teamBId || "HB");
  const nameA = teamA?.name || match.teamAId;
  const nameB = match.teamBId === "bye" ? "Scheduled Bye" : teamB?.name || match.teamBId;

  return (
    <div className="w-full bg-hpl-surface text-hpl-text rounded-2xl p-4 sm:p-6 shadow-card border border-hpl-border relative overflow-hidden">
      {/* Stadium ambient light effect */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-hpl-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-hpl-border/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top match strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-hpl-border text-xs text-hpl-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] bg-hpl-surface-2 px-2.5 py-1 rounded-lg border border-hpl-border">
            {match.sportId}
          </span>
          <span className="font-medium text-hpl-accent">{match.round}</span>
        </div>

        <div className="flex items-center gap-2">
          {match.isDemo && (
            <Badge variant="warning" size="sm">
              Demo Data
            </Badge>
          )}
          {isLive ? (
            <Badge variant="live" size="sm" aria-live="polite">
              <Radio className="w-3 h-3 mr-1 animate-pulse" />
              LIVE
            </Badge>
          ) : (
            <Badge variant={match.status === "completed" ? "completed" : "upcoming"} size="sm">
              {match.status.toUpperCase()}
            </Badge>
          )}

          {matchTimerOrStatus && (
            <span className="font-mono font-bold text-hpl-gold bg-hpl-surface-2 px-2 py-0.5 rounded border border-hpl-gold/30">
              {matchTimerOrStatus}
            </span>
          )}
        </div>
      </div>

      {/* Desktop / Tablet 3-Column Header Row */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6 py-2">
        {/* Left Column: House A (Text aligned right, badge adjacent to score) */}
        <div className="flex items-center justify-end gap-3 min-w-0 text-right">
          <div className="flex flex-col items-end min-w-0 truncate">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight truncate max-w-full font-display tracking-wide">
              {nameA}
            </span>
            <span className="text-xs text-hpl-muted truncate max-w-full">
              {teamA?.hostelBlock || "House Block"}
            </span>
            {subScoreA && (
              <span className="text-xs text-hpl-accent-soft font-mono font-semibold mt-0.5">
                {subScoreA}
              </span>
            )}
          </div>
          <div
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-lg shrink-0 border border-white/20 text-white select-none"
            style={{ backgroundColor: teamA?.primaryColor || "#38b6ff" }}
            aria-label={`${nameA} House Badge`}
          >
            {codeA}
          </div>
        </div>

        {/* Center Column: Score & Status (fixed min-width prevents overlap) */}
        <div className="min-w-[140px] sm:min-w-[180px] flex flex-col items-center justify-center text-center shrink-0 px-2">
          <div
            className="flex items-center justify-center gap-1 sm:gap-2 tabular-nums font-mono font-black text-white whitespace-nowrap tracking-tight"
            style={{ fontSize: "clamp(1.5rem, 3.8vw, 2.25rem)" }}
          >
            <span>{scoreDisplayA}</span>
            <span className="text-hpl-accent/60 font-sans font-light px-1">:</span>
            <span>{scoreDisplayB}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-hpl-muted tracking-widest mt-1">
            {match.status === "completed" ? "Final Score" : isLive ? "Current Score" : "Scheduled"}
          </span>
        </div>

        {/* Right Column: House B (Badge adjacent to score, text aligned left) */}
        <div className="flex items-center justify-start gap-3 min-w-0 text-left">
          <div
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-lg shrink-0 border border-white/20 text-white select-none"
            style={{ backgroundColor: teamB?.primaryColor || (match.teamBId === "bye" ? "#475569" : "#10b981") }}
            aria-label={`${nameB} House Badge`}
          >
            {codeB}
          </div>
          <div className="flex flex-col items-start min-w-0 truncate">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight truncate max-w-full font-display tracking-wide">
              {nameB}
            </span>
            <span className="text-xs text-hpl-muted truncate max-w-full">
              {match.teamBId === "bye" ? "Rest Period" : teamB?.hostelBlock || "House Block"}
            </span>
            {subScoreB && (
              <span className="text-xs text-hpl-accent-soft font-mono font-semibold mt-0.5">
                {subScoreB}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Stacked View (<640px) ensuring zero score/badge collision */}
      <div className="sm:hidden flex flex-col gap-2.5 bg-hpl-surface-2/60 p-3 rounded-xl border border-hpl-border">
        {/* House A Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow shrink-0 text-white"
              style={{ backgroundColor: teamA?.primaryColor || "#38b6ff" }}
            >
              {codeA}
            </div>
            <div className="truncate">
              <div className="text-sm font-bold text-white truncate">{nameA}</div>
              {subScoreA && <div className="text-[11px] text-hpl-accent-soft font-mono">{subScoreA}</div>}
            </div>
          </div>
          <div className="font-mono font-black text-lg text-white tabular-nums shrink-0">{scoreDisplayA}</div>
        </div>

        {/* House B Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-hpl-border/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow shrink-0 text-white"
              style={{ backgroundColor: teamB?.primaryColor || (match.teamBId === "bye" ? "#475569" : "#10b981") }}
            >
              {codeB}
            </div>
            <div className="truncate">
              <div className="text-sm font-bold text-white truncate">{nameB}</div>
              {subScoreB && <div className="text-[11px] text-hpl-accent-soft font-mono">{subScoreB}</div>}
            </div>
          </div>
          <div className="font-mono font-black text-lg text-white tabular-nums shrink-0">{scoreDisplayB}</div>
        </div>
      </div>

      {/* Result or Toss Text Banner */}
      {(match.resultSummary || match.tossDecision) && (
        <div className="mt-4 p-3 rounded-xl bg-hpl-surface-2 border border-hpl-border text-center text-xs font-semibold text-hpl-text">
          {match.resultSummary ? (
            <span className="text-hpl-gold">🏆 {match.resultSummary}</span>
          ) : (
            <span>
              🪙 Toss won by {match.tossWinnerTeamId === match.teamAId ? nameA : nameB} (elected to {match.tossDecision})
            </span>
          )}
        </div>
      )}

      {/* Footer match details */}
      <div className="mt-4 pt-3 border-t border-hpl-border flex flex-wrap items-center justify-between gap-3 text-[11px] text-hpl-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-hpl-accent" />
            {match.venue}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-hpl-accent" />
            Ref/Umpire: {match.refereeUmpire}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-hpl-accent" />
          {formatDateTime(match.startTime)}
        </span>
      </div>

      {children && <div className="mt-5 pt-4 border-t border-hpl-border">{children}</div>}
    </div>
  );
};
