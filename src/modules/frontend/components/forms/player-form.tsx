"use client";

import React, { useState } from "react";
import { Player, SportId, Team } from "../../types";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { validatePlayerForm } from "../../utils/validators";
import { getInitials } from "../../utils/formatters";

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
  const [name, setName] = useState(initialData?.name || "");
  const [jerseyNumber, setJerseyNumber] = useState(String(initialData?.jerseyNumber ?? 7));
  const [teamId, setTeamId] = useState(initialData?.teamId || (teams[0]?.id || "team-arkavati"));
  const [sportId, setSportId] = useState<SportId>(initialData?.sportId || "cricket");
  const [role, setRole] = useState(initialData?.role || "All-Rounder");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sportOptions = [
    { value: "cricket", label: "Cricket" },
    { value: "football", label: "Football" },
    { value: "kabaddi", label: "Kabaddi" },
    { value: "badminton", label: "Badminton" },
    { value: "volleyball", label: "Volleyball" },
    { value: "basketball", label: "Basketball" },
  ];

  const teamOptions = teams.map((t) => ({ value: t.id, label: t.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePlayerForm({ name, jerseyNumber, role });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onSubmit({
      name: name.trim(),
      jerseyNumber: Number(jerseyNumber),
      teamId,
      sportId,
      role: role.trim(),
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
        <Select
          label="Sport Discipline"
          value={sportId}
          onChange={(e) => setSportId(e.target.value as SportId)}
          options={sportOptions}
        />
        <Input
          label="Position / Role"
          placeholder="e.g. Opening Batsman, Striker"
          value={role}
          onChange={(e) => setRole(e.target.value)}
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
