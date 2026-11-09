"use client";

import React, { useState } from "react";
import { FootballScoreState, Match, Team } from "../../../types";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Undo2, SlidersHorizontal, Play, Pause, ChevronRight } from "lucide-react";
import { ManualOverrideModal } from "../manual-override-modal";
import { ConfirmDialog } from "../../ui/confirm-dialog";
import { useServices } from "../../../providers";

export interface FootballAdminConsoleProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  onScoreUpdated?: () => void;
  onUpdate?: () => void;
}

export const FootballAdminConsole: React.FC<FootballAdminConsoleProps> = ({
  match,
  teamA,
  teamB,
  onScoreUpdated,
  onUpdate,
}) => {
  const trigger = onScoreUpdated || onUpdate || (() => {});
  const { scoring, matches } = useServices();
  const state = match.scoreState as FootballScoreState;

  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoal = async (team: "A" | "B") => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as FootballScoreState;
      const targetTeamId = team === "A" ? match.teamAId : match.teamBId;
      if (team === "A") nextState.goalsA += 1;
      else nextState.goalsB += 1;

      nextState.goals.push({
        playerId: `p-${targetTeamId}-1`,
        playerInitials: team === "A" ? "HA" : "HB",
        teamId: targetTeamId,
        minute: nextState.matchTimeMinutes,
      });

      await scoring.recordEvent(match.id, {
        matchId: match.id,
        sportId: "football",
        displayTime: `${nextState.matchTimeMinutes}'`,
        eventType: "goal",
        teamId: targetTeamId,
        detail: `Goal scored by ${team === "A" ? teamA?.name : teamB?.name}!`,
      });

      await matches.updateMatch(match.id, { scoreState: nextState });
      trigger();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatIncrement = async (field: keyof FootballScoreState, val = 1) => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as FootballScoreState;
      (nextState[field] as number) = ((nextState[field] as number) || 0) + val;
      await matches.updateMatch(match.id, { scoreState: nextState });
      trigger();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardEvent = async (team: "A" | "B", cardType: "yellow" | "red") => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as FootballScoreState;
      const targetTeamId = team === "A" ? match.teamAId : match.teamBId;
      if (cardType === "yellow") {
        if (team === "A") nextState.yellowCardsA += 1;
        else nextState.yellowCardsB += 1;
      } else {
        if (team === "A") nextState.redCardsA += 1;
        else nextState.redCardsB += 1;
      }

      await scoring.recordEvent(match.id, {
        matchId: match.id,
        sportId: "football",
        displayTime: `${nextState.matchTimeMinutes}'`,
        eventType: `${cardType}_card`,
        teamId: targetTeamId,
        detail: `${cardType.toUpperCase()} card given to ${team === "A" ? teamA?.name : teamB?.name}.`,
      });

      await matches.updateMatch(match.id, { scoreState: nextState });
      trigger();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Score Control Strip */}
      <Card variant="default" className="p-4 flex flex-wrap items-center justify-between gap-4 bg-hpl-surface border-hpl-border">
        <div>
          <span className="text-[11px] font-bold uppercase text-hpl-accent">Football Operations</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {teamA?.name} <span className="text-hpl-accent font-sans">{state.goalsA}</span> :{" "}
            <span className="text-hpl-accent font-sans">{state.goalsB}</span> {teamB?.name}
          </div>
          <span className="text-xs text-hpl-muted font-mono">Minute: {state.matchTimeMinutes}&apos; (Half {state.currentHalf})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleStatIncrement("matchTimeMinutes", 1)} disabled={isProcessing}>
            <Play className="w-3.5 h-3.5 mr-1" /> +1 Min
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleStatIncrement("matchTimeMinutes", 5)} disabled={isProcessing}>
            +5 Min
          </Button>
          <Button variant="outline" size="sm" onClick={async () => { await scoring.undoLastEvent(match.id); trigger(); }} disabled={isProcessing}>
            <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsOverrideOpen(true)} disabled={isProcessing}>
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Override
          </Button>
        </div>
      </Card>

      {/* Goal Scoring Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="default" className="p-4 space-y-3 bg-hpl-surface border-hpl-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white font-display">{teamA?.name}</span>
            <span className="font-mono text-xl font-black text-hpl-accent">{state.goalsA}</span>
          </div>
          <Button variant="primary" size="lg" className="w-full text-base font-bold shadow-glow" onClick={() => handleGoal("A")} disabled={isProcessing}>
            ⚽ Goal for {teamA?.shortName || "House A"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleCardEvent("A", "yellow")}>🟨 Yellow Card</Button>
            <Button variant="danger" size="sm" className="flex-1 text-xs" onClick={() => handleCardEvent("A", "red")}>🟥 Red Card</Button>
          </div>
        </Card>

        <Card variant="default" className="p-4 space-y-3 bg-hpl-surface border-hpl-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white font-display">{teamB?.name}</span>
            <span className="font-mono text-xl font-black text-hpl-accent">{state.goalsB}</span>
          </div>
          <Button variant="primary" size="lg" className="w-full text-base font-bold shadow-glow" onClick={() => handleGoal("B")} disabled={isProcessing}>
            ⚽ Goal for {teamB?.shortName || "House B"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleCardEvent("B", "yellow")}>🟨 Yellow Card</Button>
            <Button variant="danger" size="sm" className="flex-1 text-xs" onClick={() => handleCardEvent("B", "red")}>🟥 Red Card</Button>
          </div>
        </Card>
      </div>

      {/* Secondary Match Stats Counter */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-white">Live Match Stats Counters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Button variant="outline" onClick={() => handleStatIncrement("shotsA", 1)}>+1 Shot ({teamA?.shortName})</Button>
            <Button variant="outline" onClick={() => handleStatIncrement("shotsB", 1)}>+1 Shot ({teamB?.shortName})</Button>
            <Button variant="outline" onClick={() => handleStatIncrement("cornersA", 1)}>+1 Corner ({teamA?.shortName})</Button>
            <Button variant="outline" onClick={() => handleStatIncrement("cornersB", 1)}>+1 Corner ({teamB?.shortName})</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={async () => {
            const nextState = JSON.parse(JSON.stringify(state)) as FootballScoreState;
            nextState.currentHalf = nextState.currentHalf === 1 ? 2 : 1;
            nextState.matchTimeMinutes = nextState.currentHalf === 2 ? 45 : 0;
            await matches.updateMatch(match.id, { scoreState: nextState });
            trigger();
          }}
          disabled={isProcessing}
        >
          Toggle Half (Current: Half {state.currentHalf})
        </Button>
        <Button variant="danger" onClick={() => setConfirmEndOpen(true)} disabled={isProcessing}>
          Final Whistle (Complete Match)
        </Button>
      </div>

      <ManualOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        sportName="Football"
        currentScoreA={state.goalsA}
        currentScoreB={state.goalsB}
        teamAName={teamA?.name || "Team A"}
        teamBName={teamB?.name || "Team B"}
        onApplyOverride={async (nA, nB, reason) => {
          const nextState = JSON.parse(JSON.stringify(state)) as FootballScoreState;
          nextState.goalsA = nA;
          nextState.goalsB = nB;
          await scoring.manualOverrideScore(match.id, nextState, reason);
          await matches.updateMatch(match.id, { scoreState: nextState });
          trigger();
        }}
      />

      <ConfirmDialog
        isOpen={confirmEndOpen}
        title="Complete Football Match"
        message="This will signal full-time and seal the live result. Are you sure?"
        confirmLabel="Blow Full-Time Whistle"
        onConfirm={async () => {
          await matches.updateMatchStatus(match.id, "completed");
          setConfirmEndOpen(false);
          trigger();
        }}
        onCancel={() => setConfirmEndOpen(false)}
      />
    </div>
  );
};
