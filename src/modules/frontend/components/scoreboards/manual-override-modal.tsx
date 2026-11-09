"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AlertCircle } from "lucide-react";
import { validateScoreOverride } from "../../utils/validators";

export interface ManualOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sportName: string;
  currentScoreA: number | string;
  currentScoreB: number | string;
  teamAName: string;
  teamBName: string;
  onApplyOverride: (newScoreA: number, newScoreB: number, reason: string) => Promise<void>;
}

export const ManualOverrideModal: React.FC<ManualOverrideModalProps> = ({
  isOpen,
  onClose,
  sportName,
  currentScoreA,
  currentScoreB,
  teamAName,
  teamBName,
  onApplyOverride,
}) => {
  const [valA, setValA] = useState(String(currentScoreA));
  const [valB, setValB] = useState(String(currentScoreB));
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateScoreOverride(reason);
    if (!validation.isValid) {
      setError(validation.errors.reason);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onApplyOverride(Number(valA) || 0, Number(valB) || 0, reason.trim());
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to override score.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manual Score Override (${sportName})`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-950/30 rounded-2xl border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Manual override modifies the authoritative score directly. This action is permanently logged in the match audit timeline.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={`${teamAName} Score`}
            type="number"
            value={valA}
            onChange={(e) => setValA(e.target.value)}
            required
          />
          <Input
            label={`${teamBName} Score`}
            type="number"
            value={valB}
            onChange={(e) => setValB(e.target.value)}
            required
          />
        </div>

        <Input
          label="Mandatory Reason for Override"
          placeholder="e.g. Umpire overturned penalty decision after consultation"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" type="submit" isLoading={isSubmitting}>
            Apply Override
          </Button>
        </div>
      </form>
    </Modal>
  );
};
