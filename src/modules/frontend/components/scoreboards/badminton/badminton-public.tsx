import React from "react";
import { BadmintonScoreState, Match, Team } from "../../../types";
import { ScoreboardShell } from "../scoreboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

export interface BadmintonPublicScoreboardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
}

export const BadmintonPublicScoreboard: React.FC<BadmintonPublicScoreboardProps> = ({
  match,
  teamA,
  teamB,
}) => {
  const state = match.scoreState as BadmintonScoreState;

  return (
    <div className="space-y-6">
      <ScoreboardShell
        match={match}
        teamA={teamA}
        teamB={teamB}
        scoreDisplayA={state.currentScoreA}
        scoreDisplayB={state.currentScoreB}
        subScoreA={`Games: ${state.setsWonA} ${state.servingTeamId === match.teamAId ? "🏸 (Serving)" : ""}`}
        subScoreB={`Games: ${state.setsWonB} ${state.servingTeamId === match.teamBId ? "🏸 (Serving)" : ""}`}
        matchTimerOrStatus={`Game ${state.currentGame} of 3`}
      />

      {/* Game-by-Game Score Chips Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between text-white">
            <span>Game History (Best of 3)</span>
            <span className="text-xs font-normal text-hpl-muted capitalize">
              {state.matchType} Match
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {state.games.map((g) => {
              const isCurrent = g.gameNumber === state.currentGame;
              return (
                <div
                  key={g.gameNumber}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? "bg-hpl-surface-2 border-hpl-accent shadow-glow"
                      : "bg-hpl-surface border-hpl-border"
                  }`}
                >
                  <div className="text-xs font-bold text-hpl-accent uppercase tracking-wider mb-1 font-display">
                    Game {g.gameNumber} {g.isCompleted && "✓"}
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    {g.scoreA} : {g.scoreB}
                  </div>
                  <div className="text-[11px] text-hpl-muted mt-1">
                    {g.isCompleted
                      ? `Winner: ${g.winnerTeamId === match.teamAId ? teamA?.name : teamB?.name}`
                      : "In Progress"}
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
