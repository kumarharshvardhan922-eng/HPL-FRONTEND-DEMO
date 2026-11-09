import React from "react";
import Link from "next/link";
import { Match, Team } from "../../types";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowRight } from "lucide-react";
import { getInitials } from "../../utils/formatters";

export interface HomeLiveCardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
}

export const HomeLiveCard: React.FC<HomeLiveCardProps> = ({ match: m, teamA: tA, teamB: tB }) => {
  const codeA = tA?.shortName || getInitials(tA?.name || m.teamAId);
  const codeB = tB?.shortName || getInitials(tB?.name || m.teamBId);

  const scoreA =
    m.sportId === "cricket" && "runsA" in m.scoreState
      ? `${m.scoreState.runsA}/${m.scoreState.wicketsA}`
      : "goalsA" in m.scoreState
      ? m.scoreState.goalsA
      : "scoreA" in m.scoreState
      ? m.scoreState.scoreA
      : "0";

  const scoreB =
    m.sportId === "cricket" && "runsB" in m.scoreState
      ? `${m.scoreState.runsB}/${m.scoreState.wicketsB}`
      : "goalsB" in m.scoreState
      ? m.scoreState.goalsB
      : "scoreB" in m.scoreState
      ? m.scoreState.scoreB
      : "0";

  return (
    <Link href={`/matches/${m.id}`}>
      <Card
        variant="default"
        className="p-4 hover:border-hpl-accent hover:shadow-glow transition-all cursor-pointer bg-hpl-surface border-hpl-border group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-2 border-b border-hpl-border text-xs">
          <span className="font-bold text-hpl-accent uppercase text-[10px] bg-hpl-surface-2 px-2 py-0.5 rounded border border-hpl-border">
            {m.sportId}
          </span>
          <div className="flex items-center gap-1.5">
            {m.isDemo && <Badge variant="warning" size="sm">Demo Data</Badge>}
            <Badge variant="live" size="sm">LIVE</Badge>
          </div>
        </div>

        {/* 3-Column Aligned Row */}
        <div className="py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* House A */}
          <div className="flex items-center justify-end gap-2 min-w-0 text-right">
            <span className="text-xs font-bold text-white truncate max-w-full font-display">
              {tA?.name || m.teamAId}
            </span>
            <div
              className="w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 border border-white/20"
              style={{ backgroundColor: tA?.primaryColor || "#38b6ff" }}
            >
              {codeA}
            </div>
          </div>

          {/* Middle Score */}
          <div className="min-w-[80px] text-center font-mono font-black text-sm text-white px-1 whitespace-nowrap tabular-nums">
            {scoreA} : {scoreB}
          </div>

          {/* House B */}
          <div className="flex items-center justify-start gap-2 min-w-0 text-left">
            <div
              className="w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 border border-white/20"
              style={{ backgroundColor: tB?.primaryColor || "#10b981" }}
            >
              {codeB}
            </div>
            <span className="text-xs font-bold text-white truncate max-w-full font-display">
              {tB?.name || m.teamBId}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-hpl-border flex items-center justify-between text-[11px] text-hpl-muted">
          <span className="truncate">{m.venue}</span>
          <span className="text-hpl-accent font-semibold flex items-center shrink-0 group-hover:text-hpl-accent-soft">
            Watch Live <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Card>
    </Link>
  );
};

