import React from "react";
import { BasketballScoreState, Match, Team } from "../../../types";
import { ScoreboardShell } from "../scoreboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/table";
import { formatGameClock, isBonusSituation } from "../../../utils/basketball-calc";
import { Dribbble } from "lucide-react";

export interface BasketballPublicScoreboardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
}

export const BasketballPublicScoreboard: React.FC<BasketballPublicScoreboardProps> = ({
  match,
  teamA,
  teamB,
}) => {
  const state = match.scoreState as BasketballScoreState;
  const inBonusA = isBonusSituation(state.teamFoulsA);
  const inBonusB = isBonusSituation(state.teamFoulsB);

  return (
    <div className="space-y-6">
      <ScoreboardShell
        match={match}
        teamA={teamA}
        teamB={teamB}
        scoreDisplayA={state.scoreA}
        scoreDisplayB={state.scoreB}
        subScoreA={`Fouls: ${state.teamFoulsA} ${inBonusA ? "⚠️ BONUS" : ""} | TO: ${state.timeoutsRemainingA}`}
        subScoreB={`Fouls: ${state.teamFoulsB} ${inBonusB ? "⚠️ BONUS" : ""} | TO: ${state.timeoutsRemainingB}`}
        matchTimerOrStatus={
          match.status === "completed"
            ? "Final"
            : `${state.currentQuarter} — ${formatGameClock(state.quarterTimeRemainingSeconds)}`
        }
      />

      {/* Quarter by Quarter Box Score */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Dribbble className="w-4 h-4 text-hpl-accent" />
              <span>Quarter Scores</span>
            </div>
            <div className="flex items-center gap-3">
              {inBonusA && <Badge variant="warning" size="sm">{teamA?.shortName} in Bonus</Badge>}
              {inBonusB && <Badge variant="warning" size="sm">{teamB?.shortName} in Bonus</Badge>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>House</TableHead>
                {state.quarterScores.map((q) => (
                  <TableHead key={q.quarter} className="text-center">{q.quarter}</TableHead>
                ))}
                <TableHead className="text-right font-black">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-white">{teamA?.name || "Team A"}</TableCell>
                {state.quarterScores.map((q) => (
                  <TableCell key={q.quarter} className="text-center font-mono text-white/90">{q.scoreA}</TableCell>
                ))}
                <TableCell className="text-right font-black font-mono text-hpl-accent text-base">{state.scoreA}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-white">{teamB?.name || "Team B"}</TableCell>
                {state.quarterScores.map((q) => (
                  <TableCell key={q.quarter} className="text-center font-mono text-white/90">{q.scoreB}</TableCell>
                ))}
                <TableCell className="text-right font-black font-mono text-hpl-accent text-base">{state.scoreB}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Player stats table */}
      {Object.keys(state.playerStats).length > 0 && (
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white">Top Player Box Scores</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Athlete</TableHead>
                  <TableHead className="text-right">PTS</TableHead>
                  <TableHead className="text-right">REB</TableHead>
                  <TableHead className="text-right">AST</TableHead>
                  <TableHead className="text-right">FOULS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(state.playerStats).map(([pid, pStats]) => (
                  <TableRow key={pid}>
                    <TableCell className="font-semibold text-white">{pid}</TableCell>
                    <TableCell className="text-right font-black font-mono text-hpl-accent">{pStats.points}</TableCell>
                    <TableCell className="text-right font-mono text-white/80">{pStats.rebounds || 0}</TableCell>
                    <TableCell className="text-right font-mono text-white/80">{pStats.assists || 0}</TableCell>
                    <TableCell className="text-right font-mono text-red-400">{pStats.fouls}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
