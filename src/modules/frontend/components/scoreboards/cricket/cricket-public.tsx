import React from "react";
import { CricketScoreState, Match, Team } from "../../../types";
import { ScoreboardShell } from "../scoreboard-shell";
import { calculateRunRate, calculateRequiredRunRate } from "../../../utils/cricket-calc";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/table";

export interface CricketPublicScoreboardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
}

export const CricketPublicScoreboard: React.FC<CricketPublicScoreboardProps> = ({
  match,
  teamA,
  teamB,
}) => {
  const state = match.scoreState as CricketScoreState;
  const isBattingA = state.currentBattingTeamId === state.sportId || state.currentBattingTeamId === match.teamAId;

  const runs = isBattingA ? state.runsA : state.runsB;
  const wickets = isBattingA ? state.wicketsA : state.wicketsB;
  const overs = isBattingA ? state.oversA : state.oversB;
  const balls = isBattingA ? state.ballsA : state.ballsB;
  const extras = isBattingA ? state.extrasA : state.extrasB;

  const crr = calculateRunRate(runs, overs, balls);
  const rrr = state.targetRuns
    ? calculateRequiredRunRate(state.targetRuns, runs, state.totalOversAllowed, overs, balls)
    : null;

  const totalExtras = extras.wides + extras.noBalls + extras.byes + extras.legByes;

  return (
    <div className="space-y-6">
      {/* Main Score Header with Robust 3-Column Grid */}
      <ScoreboardShell
        match={match}
        teamA={teamA}
        teamB={teamB}
        scoreDisplayA={`${state.runsA}/${state.wicketsA}`}
        scoreDisplayB={`${state.runsB}/${state.wicketsB}`}
        subScoreA={`${state.oversA}.${state.ballsA} ov`}
        subScoreB={`${state.oversB}.${state.ballsB} ov`}
        matchTimerOrStatus={state.currentInnings === 2 && state.targetRuns ? `Target: ${state.targetRuns}` : `Innings ${state.currentInnings}`}
      >
        {/* Recent Balls Strip */}
        {state.recentBalls && state.recentBalls.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-hpl-accent">This Over:</span>
            <div className="flex items-center gap-1.5">
              {state.recentBalls.map((b, i) => {
                const isWicket = b.toUpperCase() === "W";
                const isFour = b === "4";
                const isSix = b === "6";
                return (
                  <span
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-sm ${
                      isWicket
                        ? "bg-hpl-live text-white shadow-red-500/30"
                        : isSix
                        ? "bg-hpl-accent text-hpl-deep shadow-glow font-black"
                        : isFour
                        ? "bg-hpl-surface-2 text-hpl-accent border border-hpl-accent/50"
                        : "bg-hpl-surface-2 text-white border border-hpl-border"
                    }`}
                  >
                    {b}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </ScoreboardShell>

      {/* Run Rates & Target Metrics Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-accent">Current Run Rate</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">{crr}</div>
        </Card>
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-gold">Required Run Rate</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-hpl-gold mt-1">
            {rrr !== null ? rrr : "—"}
          </div>
        </Card>
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-accent-soft">Target Runs</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
            {state.targetRuns || "—"}
          </div>
        </Card>
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <div className="text-[11px] font-bold uppercase text-hpl-muted">Total Extras</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">{totalExtras}</div>
          <div className="text-[10px] text-hpl-muted mt-0.5 font-mono">
            wd: {extras.wides}, nb: {extras.noBalls}, b: {extras.byes}, lb: {extras.legByes}
          </div>
        </Card>
      </div>

      {/* Batting Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between text-white">
            <span>Batting Scorecard</span>
            <span className="text-xs font-normal text-hpl-muted">
              Innings {state.currentInnings}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-hpl-accent">Batter</TableHead>
                <TableHead className="text-right text-hpl-accent">R</TableHead>
                <TableHead className="text-right text-hpl-accent">B</TableHead>
                <TableHead className="text-right text-hpl-accent">4s</TableHead>
                <TableHead className="text-right text-hpl-accent">6s</TableHead>
                <TableHead className="text-right text-hpl-accent">SR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(state.batsmen).map((b) => {
                const isStriker = b.playerId === state.strikerId;
                const isNonStriker = b.playerId === state.nonStrikerId;
                return (
                  <TableRow key={b.playerId}>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{b.playerId}</span>
                        {isStriker && <span className="text-hpl-gold font-bold">*</span>}
                        {isNonStriker && <span className="text-hpl-muted text-xs">†</span>}
                      </div>
                      {b.dismissalDetail && (
                        <div className="text-[11px] text-hpl-muted font-normal">{b.dismissalDetail}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-white font-mono">{b.runs}</TableCell>
                    <TableCell className="text-right text-hpl-muted font-mono">{b.balls}</TableCell>
                    <TableCell className="text-right text-hpl-muted font-mono">{b.fours}</TableCell>
                    <TableCell className="text-right text-hpl-muted font-mono">{b.sixes}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-hpl-accent-soft">{b.strikeRate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bowling Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-white">Bowling Scorecard</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-hpl-accent">Bowler</TableHead>
                <TableHead className="text-right text-hpl-accent">O</TableHead>
                <TableHead className="text-right text-hpl-accent">M</TableHead>
                <TableHead className="text-right text-hpl-accent">R</TableHead>
                <TableHead className="text-right text-hpl-accent">W</TableHead>
                <TableHead className="text-right text-hpl-accent">Econ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(state.bowlers).map((bw) => (
                <TableRow key={bw.playerId}>
                  <TableCell className="font-medium text-white">{bw.playerId}</TableCell>
                  <TableCell className="text-right font-mono text-hpl-muted">{`${bw.overs}.${bw.balls}`}</TableCell>
                  <TableCell className="text-right text-hpl-muted font-mono">{bw.maidens}</TableCell>
                  <TableCell className="text-right font-bold text-white font-mono">{bw.runsConceded}</TableCell>
                  <TableCell className="text-right font-bold text-hpl-gold font-mono">{bw.wickets}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-hpl-accent-soft">{bw.economy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
