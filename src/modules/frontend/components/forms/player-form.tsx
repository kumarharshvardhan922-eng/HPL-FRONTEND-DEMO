"use client";

import React, { useState, useEffect } from "react";
import { Player, SportId, Team } from "../../types";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { validatePlayerForm } from "../../utils/validators";
import { getInitials } from "../../utils/formatters";
import { useAuthView } from "../../providers/auth-view-provider";
import { HPL_SPORTS } from "../../config/sports";
import { Lock } from "lucide-react";

export interface PlayerFormProps {
  initialData?: Partial<Player>;
  teams: Team[];
  onSubmit: (data: Omit<Player, "id">) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({
  initialData,
  teams,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { role, assignedSportIds } = useAuthView();
  const isSportLocked = role === "sport_admin" && assignedSportIds.length > 0;
  const defaultSport = isSportLocked ? assignedSportIds[0] : initialData?.sportId || "cricket";

  const [name, setName] = useState(initialData?.name || "");
  const [jerseyNumber, setJerseyNumber] = useState(String(initialData?.jerseyNumber ?? 7));
  const [teamId, setTeamId] = useState(initialData?.teamId || (teams[0]?.id || "team-arkavati"));
  const [sportId, setSportId] = useState<SportId>(defaultSport);
  const [roleField, setRoleField] = useState(initialData?.role || "All-Rounder");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isSportLocked) {
      setSportId(assignedSportIds[0]);
    }
  }, [isSportLocked, assignedSportIds]);

  const sportOptions = HPL_SPORTS.map((s) => ({ value: s.id, label: s.name }));
  const teamOptions = teams.map((t) => ({ value: t.id, label: t.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePlayerForm({ name, jerseyNumber, role: roleField });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onSubmit({
      name: name.trim(),
      jerseyNumber: Number(jerseyNumber),
      teamId,
      sportId: isSportLocked ? assignedSportIds[0] : sportId,
      role: roleField.trim(),
      photoPlaceholderUrl: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo Placeholder Preview */}
      <div className="flex items-center gap-4 p-3 bg-hpl-surface-2 rounded-xl border border-hpl-border">
        <div className="w-14 h-14 rounded-2xl bg-hpl-accent text-hpl-deep flex items-center justify-center font-bold text-lg shadow-glow font-display">
          {getInitials(name || "Player")}
        </div>
        <div>
          <span className="text-xs font-bold text-white">Photo Avatar Preview</span>
          <p className="text-[11px] text-hpl-muted">Auto-generated initials avatar for roster cards</p>
        </div>
      </div>

      <Input
        label="Player Full Name"
        placeholder="e.g. Rohan Verma"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Jersey Number (0-99)"
          type="number"
          min="0"
          max="99"
          value={jerseyNumber}
          onChange={(e) => setJerseyNumber(e.target.value)}
          error={errors.jerseyNumber}
          required
        />
        <Select
          label="Championship House"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          options={teamOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isSportLocked ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-white">Sport Discipline</label>
              <span
                className="inline-flex items-center gap-1 text-[11px] text-hpl-accent font-medium cursor-help"
                title="Locked to your assigned sport"
              >
                <Lock className="w-3 h-3" />
                Locked
              </span>
            </div>
            <Select
              label=""
              value={sportId}
              disabled
              onChange={() => {}}
              options={sportOptions}
              className="opacity-75 cursor-not-allowed bg-hpl-surface-2/60"
            />
          </div>
        ) : (
          <Select
            label="Sport Discipline"
            value={sportId}
            onChange={(e) => setSportId(e.target.value as SportId)}
            options={sportOptions}
          />
        )}
        <Input
          label="Position / Role"
          placeholder="e.g. Opening Batsman, Striker"
          value={roleField}
          onChange={(e) => setRoleField(e.target.value)}
          error={errors.role}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-hpl-border">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading} className="shadow-glow">
          {initialData?.name ? "Update Athlete" : "Register Athlete"}
        </Button>
      </div>
    </form>
  );
};
