import React from "react";
import { KabaddiScoreState, Match, Team } from "../../../types";
import { ScoreboardShell } from "../scoreboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/table";
import { formatSecondsToTime } from "../../../utils/formatters";
import { Zap } from "lucide-react";

export interface KabaddiPublicScoreboardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
}

export const KabaddiPublicScoreboard: React.FC<KabaddiPublicScoreboardProps> = ({
  match,
  teamA,
  teamB,
}) => {
  const state = match.scoreState as KabaddiScoreState;

  return (
    <div className="space-y-6">
      <ScoreboardShell
        match={match}
        teamA={teamA}
        teamB={teamB}
        scoreDisplayA={state.scoreA}
        scoreDisplayB={state.scoreB}
        subScoreA={`R:${state.raidPointsA} T:${state.tacklePointsA} B:${state.bonusPointsA}`}
        subScoreB={`R:${state.raidPointsB} T:${state.tacklePointsB} B:${state.bonusPointsB}`}
        matchTimerOrStatus={
          match.status === "completed"
            ? "Full Time"
            : `Half ${state.currentHalf} — ${formatSecondsToTime(state.halfRemainingSeconds)}`
        }
      >
        {state.isDoOrDieRaid && (
          <div className="flex items-center justify-center pt-2">
            <Badge variant="live" size="md" className="bg-hpl-gold text-hpl-deep font-black animate-pulse shadow-glow">
              ⚡ DO-OR-DIE RAID IN PROGRESS
            </Badge>
          </div>
        )}
      </ScoreboardShell>

      {/* Points breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-accent">Raid Points</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
            {state.raidPointsA} : {state.raidPointsB}
          </div>
        </Card>
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-gold">Tackle Points</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-hpl-gold mt-1">
            {state.tacklePointsA} : {state.tacklePointsB}
          </div>
        </Card>
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-accent-soft">Bonus Points</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
            {state.bonusPointsA} : {state.bonusPointsB}
          </div>
        </Card>
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-muted">All-Outs Imposed</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
            {state.allOutsA} : {state.allOutsB}
          </div>
        </Card>
      </div>

      {/* Player points table */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
            <Zap className="w-4 h-4 text-hpl-gold" />
            <span>Kabaddi Star Raiders & Defenders</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-hpl-accent">Player</TableHead>
                <TableHead className="text-right text-hpl-accent">Raid Pts</TableHead>
                <TableHead className="text-right text-hpl-accent">Tackle Pts</TableHead>
                <TableHead className="text-right text-hpl-accent">Bonus</TableHead>
                <TableHead className="text-right font-black text-hpl-accent">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(state.playerStats).map(([pid, stats]) => (
                <TableRow key={pid}>
                  <TableCell className="font-semibold text-white">{pid}</TableCell>
                  <TableCell className="text-right font-mono text-hpl-muted">{stats.raidPoints}</TableCell>
                  <TableCell className="text-right font-mono text-hpl-gold font-bold">{stats.tacklePoints}</TableCell>
                  <TableCell className="text-right font-mono text-hpl-muted">{stats.bonusPoints}</TableCell>
                  <TableCell className="text-right font-black font-mono text-hpl-accent">
                    {stats.totalPoints}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
