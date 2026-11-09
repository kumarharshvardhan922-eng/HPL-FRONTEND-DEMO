"use client";

import React, { useState } from "react";
import { Match, Team, VolleyballScoreState } from "../../../types";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Undo2, SlidersHorizontal, RotateCw } from "lucide-react";
import { ManualOverrideModal } from "../manual-override-modal";
import { ConfirmDialog } from "../../ui/confirm-dialog";
import { checkSetWinner, checkVolleyballMatchWinner } from "../../../utils/volleyball-calc";
import { useServices } from "../../../providers";

export interface VolleyballAdminConsoleProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  onUpdate?: () => void;
  onScoreUpdated?: () => void;
}

export const VolleyballAdminConsole: React.FC<VolleyballAdminConsoleProps> = ({
  match,
  teamA,
  teamB,
  onUpdate,
  onScoreUpdated,
}) => {
  const { scoring, matches } = useServices();
  const state = match.scoreState as VolleyballScoreState;

  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerUpdate = () => {
    onUpdate?.();
    onScoreUpdated?.();
  };

  const handlePoint = async (team: "A" | "B") => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as VolleyballScoreState;
      if (team === "A") {
        nextState.currentScoreA += 1;
        nextState.servingTeamId = match.teamAId;
      } else {
        nextState.currentScoreB += 1;
        nextState.servingTeamId = match.teamBId;
      }

      const activeSet = nextState.sets.find((s) => s.setNumber === nextState.currentSet);
      if (activeSet) {
        activeSet.scoreA = nextState.currentScoreA;
        activeSet.scoreB = nextState.currentScoreB;
      }

      await scoring.recordEvent(match.id, {
        matchId: match.id,
        sportId: "volleyball",
        displayTime: `S${nextState.currentSet}`,
        eventType: "point",
        teamId: team === "A" ? match.teamAId : match.teamBId,
        detail: `Point awarded to ${team === "A" ? teamA?.name : teamB?.name} (${nextState.currentScoreA}-${nextState.currentScoreB}).`,
      });

      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = async (team: "A" | "B") => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as VolleyballScoreState;
      if (team === "A") {
        nextState.rotationA = (nextState.rotationA % 6) + 1;
      } else {
        nextState.rotationB = (nextState.rotationB % 6) + 1;
      }
      await matches.updateMatch(match.id, { scoreState: nextState });
      triggerUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndSet = async () => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as VolleyballScoreState;
      const winner = checkSetWinner(nextState.currentSet, nextState.currentScoreA, nextState.currentScoreB);
      if (winner === "A") nextState.setsWonA += 1;
      else if (winner === "B") nextState.setsWonB += 1;

      const activeSet = nextState.sets.find((s) => s.setNumber === nextState.currentSet);
      if (activeSet) {
        activeSet.isCompleted = true;
        activeSet.winnerTeamId = winner === "A" ? match.teamAId : match.teamBId;
      }

      if (nextState.currentSet < 5 && !checkVolleyballMatchWinner(nextState.setsWonA, nextState.setsWonB)) {
        nextState.currentSet += 1;
        nextState.currentScoreA = 0;
        nextState.currentScoreB = 0;
      }

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
            Set {state.currentSet} of 5
          </span>
          <div className="text-xl font-black text-white">
            {teamA?.name} ({state.setsWonA}) {state.currentScoreA} : {state.currentScoreB} ({state.setsWonB}) {teamB?.name}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handlePoint("A")}
            disabled={isProcessing}
            className="w-full h-20 text-lg font-black"
          >
            +1 Point {teamA?.shortName}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotate("A")}
            disabled={isProcessing}
            className="w-full"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1 text-hpl-accent" />
            Rotate Position ({state.rotationA})
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handlePoint("B")}
            disabled={isProcessing}
            className="w-full h-20 text-lg font-black bg-cyan-700 hover:bg-cyan-600"
          >
            +1 Point {teamB?.shortName}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotate("B")}
            disabled={isProcessing}
            className="w-full"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1 text-hpl-accent" />
            Rotate Position ({state.rotationB})
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button variant="secondary" onClick={handleEndSet} disabled={isProcessing}>
          Finish Set {state.currentSet}
        </Button>
        <Button variant="danger" onClick={() => setConfirmEndOpen(true)} disabled={isProcessing}>
          End Match
        </Button>
      </div>

      <ManualOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        sportName="Volleyball"
        currentScoreA={state.currentScoreA}
        currentScoreB={state.currentScoreB}
        teamAName={teamA?.name || "Team A"}
        teamBName={teamB?.name || "Team B"}
        onApplyOverride={async (nA, nB, reason) => {
          const nextState = JSON.parse(JSON.stringify(state)) as VolleyballScoreState;
          nextState.currentScoreA = nA;
          nextState.currentScoreB = nB;
          await scoring.manualOverrideScore(match.id, nextState, reason);
          await matches.updateMatch(match.id, { scoreState: nextState });
          triggerUpdate();
        }}
      />

      <ConfirmDialog
        isOpen={confirmEndOpen}
        title="Complete Volleyball Match"
        message="Finalize set scores and mark match complete?"
        confirmLabel="Confirm Complete"
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
