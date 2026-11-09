"use client";

import React, { useState } from "react";
import { CricketScoreState, Match, Team } from "../../../types";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Undo2, SlidersHorizontal, RefreshCw } from "lucide-react";
import { ManualOverrideModal } from "../manual-override-modal";
import { ConfirmDialog } from "../../ui/confirm-dialog";
import { addBallToOvers } from "../../../utils/cricket-calc";
import { useServices } from "../../../providers";

export interface CricketAdminConsoleProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  onScoreUpdated?: () => void;
  onUpdate?: () => void;
}

export const CricketAdminConsole: React.FC<CricketAdminConsoleProps> = ({
  match,
  teamA,
  teamB,
  onScoreUpdated,
  onUpdate,
}) => {
  const triggerUpdate = onScoreUpdated || onUpdate || (() => {});
  const { scoring, matches } = useServices();
  const state = match.scoreState as CricketScoreState;

  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [confirmEndMatchOpen, setConfirmEndMatchOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isBattingA = state.currentBattingTeamId === match.teamAId;
  const currentRuns = isBattingA ? state.runsA : state.runsB;
  const currentWickets = isBattingA ? state.wicketsA : state.wicketsB;
  const currentOvers = isBattingA ? state.oversA : state.oversB;
  const currentBalls = isBattingA ? state.ballsA : state.ballsB;

  const handleScoreBall = async (runs: number, ballType: "normal" | "wide" | "noball" | "wicket" | "bye" | "legbye") => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as CricketScoreState;
      let displayChip = String(runs);

      if (ballType === "normal" || ballType === "wicket") {
        displayChip = ballType === "wicket" ? "W" : String(runs);
        const targetTeam = isBattingA ? "A" : "B";
        if (targetTeam === "A") {
          if (ballType === "wicket") nextState.wicketsA += 1;
          else nextState.runsA += runs;
          const { overs, balls } = addBallToOvers(nextState.oversA, nextState.ballsA);
          nextState.oversA = overs;
          nextState.ballsA = balls;
        } else {
          if (ballType === "wicket") nextState.wicketsB += 1;
          else nextState.runsB += runs;
          const { overs, balls } = addBallToOvers(nextState.oversB, nextState.ballsB);
          nextState.oversB = overs;
          nextState.ballsB = balls;
        }
      } else {
        displayChip = ballType === "wide" ? "wd" : ballType === "noball" ? "nb" : ballType === "bye" ? "b" : "lb";
        if (isBattingA) {
          nextState.runsA += ballType === "wide" || ballType === "noball" ? 1 + runs : runs;
          if (ballType === "wide") nextState.extrasA.wides += 1;
          if (ballType === "noball") nextState.extrasA.noBalls += 1;
        } else {
          nextState.runsB += ballType === "wide" || ballType === "noball" ? 1 + runs : runs;
          if (ballType === "wide") nextState.extrasB.wides += 1;
          if (ballType === "noball") nextState.extrasB.noBalls += 1;
        }
      }

      nextState.recentBalls.push(displayChip);
      if (nextState.recentBalls.length > 8) nextState.recentBalls.shift();

      await scoring.recordEvent(match.id, {
        matchId: match.id,
        sportId: "cricket",
        displayTime: `${currentOvers}.${currentBalls}`,
        eventType: ballType === "wicket" ? "wicket" : runs >= 4 ? (runs === 6 ? "six" : "boundary") : "run",
        teamId: isBattingA ? match.teamAId : match.teamBId,
        detail: `Score: ${runs} runs (${ballType}).`,
      });

      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotateStrike = async () => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as CricketScoreState;
      const temp = nextState.strikerId;
      nextState.strikerId = nextState.nonStrikerId;
      nextState.nonStrikerId = temp;
      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSwitchInnings = async () => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as CricketScoreState;
      nextState.currentInnings = nextState.currentInnings === 1 ? 2 : 1;
      nextState.currentBattingTeamId = nextState.currentBattingTeamId === match.teamAId ? match.teamBId : match.teamAId;
      nextState.targetRuns = nextState.runsA + 1;
      nextState.recentBalls = [];
      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card variant="default" className="p-4 flex flex-wrap items-center justify-between gap-3 bg-hpl-surface border-hpl-border">
        <div>
          <span className="text-[11px] font-bold uppercase text-hpl-accent">Current Batting House</span>
          <div className="text-xl font-black text-white font-display">
            {isBattingA ? teamA?.name : teamB?.name} — {currentRuns}/{currentWickets} ({currentOvers}.{currentBalls} ov)
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRotateStrike} disabled={isProcessing}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Rotate Strike
          </Button>
          <Button variant="outline" size="sm" onClick={async () => { await scoring.undoLastEvent(match.id); triggerUpdate(); }} disabled={isProcessing}>
            <Undo2 className="w-4 h-4 mr-1.5" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsOverrideOpen(true)} disabled={isProcessing}>
            <SlidersHorizontal className="w-4 h-4 mr-1.5" /> Override
          </Button>
        </div>
      </Card>

      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-white">Standard Ball Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
            {[0, 1, 2, 3, 4, 6].map((run) => (
              <Button
                key={run}
                variant={run === 6 ? "primary" : run === 4 ? "secondary" : "score"}
                size="lg"
                disabled={isProcessing}
                onClick={() => handleScoreBall(run, "normal")}
                className="text-lg font-black h-14"
              >
                +{run}
              </Button>
            ))}
            <Button
              variant="danger"
              size="lg"
              disabled={isProcessing}
              onClick={() => handleScoreBall(0, "wicket")}
              className="text-base font-black h-14 col-span-2 sm:col-span-1"
            >
              OUT
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-white">Extras & Special Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Button variant="outline" onClick={() => handleScoreBall(0, "wide")} disabled={isProcessing}>+1 Wide</Button>
            <Button variant="outline" onClick={() => handleScoreBall(0, "noball")} disabled={isProcessing}>+1 No Ball</Button>
            <Button variant="outline" onClick={() => handleScoreBall(1, "bye")} disabled={isProcessing}>+1 Bye</Button>
            <Button variant="outline" onClick={() => handleScoreBall(1, "legbye")} disabled={isProcessing}>+1 Leg Bye</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button variant="secondary" onClick={handleSwitchInnings} disabled={isProcessing}>
          Switch Innings (Current: Innings {state.currentInnings})
        </Button>
        <Button variant="danger" onClick={() => setConfirmEndMatchOpen(true)} disabled={isProcessing}>
          Complete Match
        </Button>
      </div>

      <ManualOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        sportName="Cricket"
        currentScoreA={state.runsA}
        currentScoreB={state.runsB}
        teamAName={teamA?.name || "Team A"}
        teamBName={teamB?.name || "Team B"}
        onApplyOverride={async (nA, nB, reason) => {
          const nextState = JSON.parse(JSON.stringify(state)) as CricketScoreState;
          nextState.runsA = nA;
          nextState.runsB = nB;
          await scoring.manualOverrideScore(match.id, nextState, reason);
          await matches.updateMatch(match.id, { scoreState: nextState });
          triggerUpdate();
        }}
      />

      <ConfirmDialog
        isOpen={confirmEndMatchOpen}
        title="Complete Cricket Match"
        message="This will mark the match as completed and lock live score changes. Are you sure?"
        confirmLabel="Finalize & Complete"
        onConfirm={async () => {
          await matches.updateMatchStatus(match.id, "completed");
          setConfirmEndMatchOpen(false);
          triggerUpdate();
        }}
        onCancel={() => setConfirmEndMatchOpen(false)}
      />
    </div>
  );
};
