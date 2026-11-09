"use client";

import React, { useState } from "react";
import { BadmintonScoreState, Match, Team } from "../../../types";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Undo2, SlidersHorizontal, RefreshCw } from "lucide-react";
import { ManualOverrideModal } from "../manual-override-modal";
import { ConfirmDialog } from "../../ui/confirm-dialog";
import { checkGameWinner, checkBadmintonMatchWinner } from "../../../utils/badminton-calc";
import { useServices } from "../../../providers";

export interface BadmintonAdminConsoleProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  onScoreUpdated?: () => void;
  onUpdate?: () => void;
}

export const BadmintonAdminConsole: React.FC<BadmintonAdminConsoleProps> = ({
  match,
  teamA,
  teamB,
  onScoreUpdated,
  onUpdate,
}) => {
  const trigger = onScoreUpdated || onUpdate || (() => {});
  const { scoring, matches } = useServices();
  const state = match.scoreState as BadmintonScoreState;

  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePoint = async (team: "A" | "B") => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as BadmintonScoreState;
      if (team === "A") {
        nextState.currentScoreA += 1;
        nextState.servingTeamId = match.teamAId;
      } else {
        nextState.currentScoreB += 1;
        nextState.servingTeamId = match.teamBId;
      }

      // Sync active game object
      const activeGame = nextState.games.find((g) => g.gameNumber === nextState.currentGame);
      if (activeGame) {
        activeGame.scoreA = nextState.currentScoreA;
        activeGame.scoreB = nextState.currentScoreB;
      }

      await scoring.recordEvent(match.id, {
        matchId: match.id,
        sportId: "badminton",
        displayTime: `G${nextState.currentGame}`,
        eventType: "point",
        teamId: team === "A" ? match.teamAId : match.teamBId,
        detail: `Point scored by ${team === "A" ? teamA?.name : teamB?.name} (${nextState.currentScoreA}-${nextState.currentScoreB}).`,
      });

      await matches.updateMatch(match.id, { scoreState: nextState });
      trigger();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndGame = async () => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as BadmintonScoreState;
      const winner = checkGameWinner(nextState.currentScoreA, nextState.currentScoreB);
      if (winner === "A") nextState.setsWonA += 1;
      else if (winner === "B") nextState.setsWonB += 1;

      const activeGame = nextState.games.find((g) => g.gameNumber === nextState.currentGame);
      if (activeGame) {
        activeGame.isCompleted = true;
        activeGame.winnerTeamId = winner === "A" ? match.teamAId : match.teamBId;
      }

      const matchWinner = checkBadmintonMatchWinner(nextState.setsWonA, nextState.setsWonB);
      if (matchWinner) {
        await matches.updateMatchStatus(match.id, "completed");
      } else if (nextState.currentGame < 3) {
        nextState.currentGame += 1;
        nextState.currentScoreA = 0;
        nextState.currentScoreB = 0;
      }

      await matches.updateMatch(match.id, { scoreState: nextState });
      trigger();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card variant="default" className="p-4 flex flex-wrap items-center justify-between gap-3 bg-hpl-surface border-hpl-border">
        <div>
          <span className="text-[11px] font-bold uppercase text-hpl-accent">Badminton Console • Game {state.currentGame}</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {teamA?.name} ({state.setsWonA}) <span className="text-hpl-accent font-sans">{state.currentScoreA}</span> :{" "}
            <span className="text-hpl-accent font-sans">{state.currentScoreB}</span> ({state.setsWonB}) {teamB?.name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={async () => {
            const nextState = JSON.parse(JSON.stringify(state)) as BadmintonScoreState;
            nextState.servingTeamId = nextState.servingTeamId === match.teamAId ? match.teamBId : match.teamAId;
            await matches.updateMatch(match.id, { scoreState: nextState });
            trigger();
          }} disabled={isProcessing}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Switch Service
          </Button>
          <Button variant="outline" size="sm" onClick={async () => { await scoring.undoLastEvent(match.id); trigger(); }} disabled={isProcessing}>
            <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsOverrideOpen(true)} disabled={isProcessing}>
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Override
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="default" className="p-5 text-center space-y-3 bg-hpl-surface border-hpl-border">
          <span className="text-sm font-bold text-white font-display">{teamA?.name}</span>
          <div className="text-4xl font-black font-mono text-white">{state.currentScoreA}</div>
          <Button variant="primary" size="lg" className="w-full text-base font-bold shadow-glow" onClick={() => handlePoint("A")} disabled={isProcessing}>
            🏸 +1 Point ({teamA?.shortName})
          </Button>
        </Card>

        <Card variant="default" className="p-5 text-center space-y-3 bg-hpl-surface border-hpl-border">
          <span className="text-sm font-bold text-white font-display">{teamB?.name}</span>
          <div className="text-4xl font-black font-mono text-white">{state.currentScoreB}</div>
          <Button variant="primary" size="lg" className="w-full text-base font-bold shadow-glow" onClick={() => handlePoint("B")} disabled={isProcessing}>
            🏸 +1 Point ({teamB?.shortName})
          </Button>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button variant="secondary" onClick={handleEndGame} disabled={isProcessing}>
          Finalize Game {state.currentGame} Result
        </Button>
        <Button variant="danger" onClick={() => setConfirmEndOpen(true)} disabled={isProcessing}>
          Declare Match Winner & Complete
        </Button>
      </div>

      <ManualOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        sportName="Badminton"
        currentScoreA={state.currentScoreA}
        currentScoreB={state.currentScoreB}
        teamAName={teamA?.name || "Team A"}
        teamBName={teamB?.name || "Team B"}
        onApplyOverride={async (nA, nB, reason) => {
          const nextState = JSON.parse(JSON.stringify(state)) as BadmintonScoreState;
          nextState.currentScoreA = nA;
          nextState.currentScoreB = nB;
          await scoring.manualOverrideScore(match.id, nextState, reason);
          await matches.updateMatch(match.id, { scoreState: nextState });
          trigger();
        }}
      />

      <ConfirmDialog
        isOpen={confirmEndOpen}
        title="Complete Badminton Match"
        message="This will mark the badminton match as completed. Are you sure?"
        confirmLabel="Complete Match"
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
