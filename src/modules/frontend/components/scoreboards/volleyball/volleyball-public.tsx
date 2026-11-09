import React from "react";
import { Match, Team, VolleyballScoreState } from "../../../types";
import { ScoreboardShell } from "../scoreboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Flame } from "lucide-react";

export interface VolleyballPublicScoreboardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
}

export const VolleyballPublicScoreboard: React.FC<VolleyballPublicScoreboardProps> = ({
  match,
  teamA,
  teamB,
}) => {
  const state = match.scoreState as VolleyballScoreState;

  return (
    <div className="space-y-6">
      <ScoreboardShell
        match={match}
        teamA={teamA}
        teamB={teamB}
        scoreDisplayA={state.currentScoreA}
        scoreDisplayB={state.currentScoreB}
        subScoreA={`Sets: ${state.setsWonA} | R:${state.rotationA} ${state.servingTeamId === match.teamAId ? "🏐" : ""}`}
        subScoreB={`Sets: ${state.setsWonB} | R:${state.rotationB} ${state.servingTeamId === match.teamBId ? "🏐" : ""}`}
        matchTimerOrStatus={`Set ${state.currentSet} of 5`}
      />

      {/* Set-by-Set History Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
            <Flame className="w-4 h-4 text-hpl-accent" />
            <span>Set-by-Set History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {state.sets.map((s) => {
              const isCurrent = s.setNumber === state.currentSet;
              return (
                <div
                  key={s.setNumber}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? "bg-hpl-surface-2 border-hpl-accent ring-2 ring-hpl-accent/20"
                      : "bg-hpl-surface-2/40 border-hpl-border"
                  }`}
                >
                  <div className="text-[10px] font-bold text-hpl-muted uppercase tracking-wider mb-1">
                    Set {s.setNumber} {s.setNumber === 5 ? "(Tiebreaker to 15)" : "(to 25)"}
                  </div>
                  <div className="text-xl font-black font-mono text-white">
                    {s.scoreA} : {s.scoreB}
                  </div>
                  <div className="text-[10px] text-hpl-muted mt-0.5">
                    {s.isCompleted
                      ? `Won by ${s.winnerTeamId === match.teamAId ? teamA?.shortName || "A" : teamB?.shortName || "B"}`
                      : isCurrent
                      ? "In Progress"
                      : "Yet to play"}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
