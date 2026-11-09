"use client";

import React, { useState } from "react";
import { KabaddiScoreState, Match, Team } from "../../../types";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Undo2, SlidersHorizontal, Zap } from "lucide-react";
import { ManualOverrideModal } from "../manual-override-modal";
import { ConfirmDialog } from "../../ui/confirm-dialog";
import { useServices } from "../../../providers";

export interface KabaddiAdminConsoleProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  onScoreUpdated?: () => void;
  onUpdate?: () => void;
}

export const KabaddiAdminConsole: React.FC<KabaddiAdminConsoleProps> = ({
  match,
  teamA,
  teamB,
  onScoreUpdated,
  onUpdate,
}) => {
  const trigger = onScoreUpdated || onUpdate || (() => {});
  const { scoring, matches } = useServices();
  const state = match.scoreState as KabaddiScoreState;

  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScoreAction = async (
    team: "A" | "B",
    action: "raid" | "tackle" | "bonus" | "allout",
    points: number
  ) => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as KabaddiScoreState;
      const targetTeamId = team === "A" ? match.teamAId : match.teamBId;

      if (team === "A") {
        nextState.scoreA += points;
        if (action === "raid") nextState.raidPointsA += points;
        else if (action === "tackle") nextState.tacklePointsA += points;
        else if (action === "bonus") nextState.bonusPointsA += points;
        else if (action === "allout") nextState.allOutsA += 1;
      } else {
        nextState.scoreB += points;
        if (action === "raid") nextState.raidPointsB += points;
        else if (action === "tackle") nextState.tacklePointsB += points;
        else if (action === "bonus") nextState.bonusPointsB += points;
        else if (action === "allout") nextState.allOutsB += 1;
      }

      await scoring.recordEvent(match.id, {
        matchId: match.id,
        sportId: "kabaddi",
        displayTime: `H${nextState.currentHalf}`,
        eventType: action === "raid" && points >= 3 ? "super_raid" : action,
        teamId: targetTeamId,
        detail: `+${points} points awarded (${action}) to ${team === "A" ? teamA?.name : teamB?.name}.`,
      });

      await matches.updateMatch(match.id, { scoreState: nextState });
      trigger();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleDoOrDie = async () => {
    setIsProcessing(true);
    try {
      const nextState = JSON.parse(JSON.stringify(state)) as KabaddiScoreState;
      nextState.isDoOrDieRaid = !nextState.isDoOrDieRaid;
      await matches.updateMatch(match.id, { scoreState: nextState });
      trigger();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Kabaddi Status Header */}
      <Card variant="default" className="p-4 flex flex-wrap items-center justify-between gap-3 bg-hpl-surface border-hpl-border">
        <div>
          <span className="text-[11px] font-bold uppercase text-hpl-accent">Pro Kabaddi Console</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {teamA?.name} <span className="text-hpl-accent font-sans">{state.scoreA}</span> :{" "}
            <span className="text-hpl-accent font-sans">{state.scoreB}</span> {teamB?.name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={state.isDoOrDieRaid ? "danger" : "outline"}
            size="sm"
            onClick={handleToggleDoOrDie}
            disabled={isProcessing}
          >
            <Zap className="w-3.5 h-3.5 mr-1" />
            {state.isDoOrDieRaid ? "Do-or-Die Active" : "Trigger Do-or-Die"}
          </Button>
          <Button variant="outline" size="sm" onClick={async () => { await scoring.undoLastEvent(match.id); trigger(); }} disabled={isProcessing}>
            <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsOverrideOpen(true)} disabled={isProcessing}>
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Override
          </Button>
        </div>
      </Card>

      {/* House A Points Pad */}
      <Card variant="default" className="p-4 space-y-3 bg-hpl-surface border-hpl-border">
        <div className="flex items-center justify-between pb-2 border-b border-hpl-border">
          <span className="text-sm font-bold text-white font-display">{teamA?.name} (Home)</span>
          <span className="font-mono text-xl font-black text-hpl-accent">{state.scoreA} pts</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <Button variant="primary" onClick={() => handleScoreAction("A", "raid", 1)} disabled={isProcessing}>+1 Raid</Button>
          <Button variant="primary" onClick={() => handleScoreAction("A", "raid", 2)} disabled={isProcessing}>+2 Multi-Raid</Button>
          <Button variant="secondary" onClick={() => handleScoreAction("A", "raid", 3)} disabled={isProcessing}>⚡ Super Raid (+3)</Button>
          <Button variant="score" onClick={() => handleScoreAction("A", "tackle", 1)} disabled={isProcessing}>+1 Tackle</Button>
          <Button variant="score" onClick={() => handleScoreAction("A", "tackle", 2)} disabled={isProcessing}>🛡️ Super Tackle (+2)</Button>
          <Button variant="outline" onClick={() => handleScoreAction("A", "bonus", 1)} disabled={isProcessing}>+1 Bonus Point</Button>
          <Button variant="danger" onClick={() => handleScoreAction("A", "allout", 2)} disabled={isProcessing} className="col-span-2 sm:col-span-1">All-Out (+2)</Button>
        </div>
      </Card>

      {/* House B Points Pad */}
      <Card variant="default" className="p-4 space-y-3 bg-hpl-surface border-hpl-border">
        <div className="flex items-center justify-between pb-2 border-b border-hpl-border">
          <span className="text-sm font-bold text-white font-display">{teamB?.name} (Away)</span>
          <span className="font-mono text-xl font-black text-hpl-accent">{state.scoreB} pts</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <Button variant="primary" onClick={() => handleScoreAction("B", "raid", 1)} disabled={isProcessing}>+1 Raid</Button>
          <Button variant="primary" onClick={() => handleScoreAction("B", "raid", 2)} disabled={isProcessing}>+2 Multi-Raid</Button>
          <Button variant="secondary" onClick={() => handleScoreAction("B", "raid", 3)} disabled={isProcessing}>⚡ Super Raid (+3)</Button>
          <Button variant="score" onClick={() => handleScoreAction("B", "tackle", 1)} disabled={isProcessing}>+1 Tackle</Button>
          <Button variant="score" onClick={() => handleScoreAction("B", "tackle", 2)} disabled={isProcessing}>🛡️ Super Tackle (+2)</Button>
          <Button variant="outline" onClick={() => handleScoreAction("B", "bonus", 1)} disabled={isProcessing}>+1 Bonus Point</Button>
          <Button variant="danger" onClick={() => handleScoreAction("B", "allout", 2)} disabled={isProcessing} className="col-span-2 sm:col-span-1">All-Out (+2)</Button>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={async () => {
            const nextState = JSON.parse(JSON.stringify(state)) as KabaddiScoreState;
            nextState.currentHalf = nextState.currentHalf === 1 ? 2 : 1;
            nextState.halfRemainingSeconds = 1200;
            await matches.updateMatch(match.id, { scoreState: nextState });
            trigger();
          }}
          disabled={isProcessing}
        >
          Toggle Half (Current: Half {state.currentHalf})
        </Button>
        <Button variant="danger" onClick={() => setConfirmEndOpen(true)} disabled={isProcessing}>
          Complete Match
        </Button>
      </div>

      <ManualOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        sportName="Kabaddi"
        currentScoreA={state.scoreA}
        currentScoreB={state.scoreB}
        teamAName={teamA?.name || "Team A"}
        teamBName={teamB?.name || "Team B"}
        onApplyOverride={async (nA, nB, reason) => {
          const nextState = JSON.parse(JSON.stringify(state)) as KabaddiScoreState;
          nextState.scoreA = nA;
          nextState.scoreB = nB;
          await scoring.manualOverrideScore(match.id, nextState, reason);
          await matches.updateMatch(match.id, { scoreState: nextState });
          trigger();
        }}
      />

      <ConfirmDialog
        isOpen={confirmEndOpen}
        title="Complete Kabaddi Match"
        message="This will signal the final whistle and lock live raid scoring. Are you sure?"
        confirmLabel="Final Whistle"
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
