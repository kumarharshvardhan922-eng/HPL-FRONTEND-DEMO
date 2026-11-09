"use client";

import React, { useState } from "react";
import { BasketballScoreState, Match, Team } from "../../../types";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Undo2, SlidersHorizontal, ChevronRight } from "lucide-react";
import { ManualOverrideModal } from "../manual-override-modal";
import { ConfirmDialog } from "../../ui/confirm-dialog";
import { isBonusSituation } from "../../../utils/basketball-calc";
import { useServices } from "../../../providers";

export interface BasketballAdminConsoleProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  onUpdate?: () => void;
  onScoreUpdated?: () => void;
}

export const BasketballAdminConsole: React.FC<BasketballAdminConsoleProps> = ({
  match,
  teamA,
  teamB,
  onUpdate,
  onScoreUpdated,
}) => {
  const { scoring, matches } = useServices();
  const state = match.scoreState as BasketballScoreState;

  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerUpdate = () => {
    onUpdate?.();
    onScoreUpdated?.();
  };

  const handleScore = async (team: "A" | "B", points: 1 | 2 | 3) => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as BasketballScoreState;
      if (team === "A") nextState.scoreA += points;
      else nextState.scoreB += points;

      // Update current quarter
      const activeQ = nextState.quarterScores.find((q) => q.quarter === String(nextState.currentQuarter));
      if (activeQ) {
        if (team === "A") activeQ.scoreA += points;
        else activeQ.scoreB += points;
      }

      await scoring.recordEvent(match.id, {
        matchId: match.id,
        sportId: "basketball",
        displayTime: `Q${nextState.currentQuarter}`,
        eventType: points === 3 ? "three_pointer" : "points",
        teamId: team === "A" ? match.teamAId : match.teamBId,
        detail: `+${points} points scored by ${team === "A" ? teamA?.name : teamB?.name}.`,
      });

      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFoul = async (team: "A" | "B") => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as BasketballScoreState;
      if (team === "A") {
        nextState.teamFoulsA += 1;
        nextState.isBonusA = isBonusSituation(nextState.teamFoulsA);
      } else {
        nextState.teamFoulsB += 1;
        nextState.isBonusB = isBonusSituation(nextState.teamFoulsB);
      }
      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdvanceQuarter = async () => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as BasketballScoreState;
      if (nextState.currentQuarter === 1) nextState.currentQuarter = 2;
      else if (nextState.currentQuarter === 2) nextState.currentQuarter = 3;
      else if (nextState.currentQuarter === 3) nextState.currentQuarter = 4;
      else if (nextState.currentQuarter === 4) nextState.currentQuarter = "OT";
      // Reset quarter fouls
      nextState.teamFoulsA = 0;
      nextState.teamFoulsB = 0;
      nextState.isBonusA = false;
      nextState.isBonusB = false;

      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = async () => {
    setIsProcessing(true);
    try {
      await scoring.undoLastEvent(match.id);
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card variant="surface" className="p-4 flex flex-wrap items-center justify-between gap-3 border-hpl-border">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-hpl-accent">
            Basketball — {state.currentQuarter}
          </span>
          <div className="text-xl font-black text-white">
            {teamA?.name} {state.scoreA} : {state.scoreB} {teamB?.name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={isProcessing}>
            <Undo2 className="w-4 h-4 mr-1.5" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsOverrideOpen(true)} disabled={isProcessing}>
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            Override
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* House A */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white">{teamA?.name || "House A"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="score" size="lg" onClick={() => handleScore("A", 1)} disabled={isProcessing}>
                +1 FT
              </Button>
              <Button variant="score" size="lg" onClick={() => handleScore("A", 2)} disabled={isProcessing}>
                +2 FG
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleScore("A", 3)}
                disabled={isProcessing}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
              >
                +3 3PT
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => handleFoul("A")} disabled={isProcessing}>
              +1 House Foul ({state.teamFoulsA})
            </Button>
          </CardContent>
        </Card>

        {/* House B */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white">{teamB?.name || "House B"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="score" size="lg" onClick={() => handleScore("B", 1)} disabled={isProcessing}>
                +1 FT
              </Button>
              <Button variant="score" size="lg" onClick={() => handleScore("B", 2)} disabled={isProcessing}>
                +2 FG
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleScore("B", 3)}
                disabled={isProcessing}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
              >
                +3 3PT
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => handleFoul("B")} disabled={isProcessing}>
              +1 House Foul ({state.teamFoulsB})
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button variant="secondary" onClick={handleAdvanceQuarter} disabled={isProcessing}>
          <ChevronRight className="w-4 h-4 mr-1.5" />
          Advance Quarter (Current: {state.currentQuarter})
        </Button>
        <Button variant="danger" onClick={() => setConfirmEndOpen(true)} disabled={isProcessing}>
          Complete Game
        </Button>
      </div>

      <ManualOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        sportName="Basketball"
        currentScoreA={state.scoreA}
        currentScoreB={state.scoreB}
        teamAName={teamA?.name || "Team A"}
        teamBName={teamB?.name || "Team B"}
        onApplyOverride={async (nA, nB, reason) => {
          const nextState = JSON.parse(JSON.stringify(state)) as BasketballScoreState;
          nextState.scoreA = nA;
          nextState.scoreB = nB;
          await scoring.manualOverrideScore(match.id, nextState, reason);
          await matches.updateMatch(match.id, { scoreState: nextState });
          triggerUpdate();
        }}
      />

      <ConfirmDialog
        isOpen={confirmEndOpen}
        title="Complete Basketball Game"
        message="Final buzzer: record final score and conclude game?"
        confirmLabel="Finalize & Complete"
        onConfirm={async () => {
          await matches.updateMatchStatus(match.id, "completed");
          setConfirmEndOpen(false);
          triggerUpdate();
        }}
        onCancel={() => setConfirmEndOpen(false)}
      />
    </div>
  );
};
