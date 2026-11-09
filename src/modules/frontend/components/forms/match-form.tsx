"use client";

import React, { useState, useEffect } from "react";
import { Match, SportId, Team } from "../../types";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { validateMatchForm } from "../../utils/validators";
import { useAuthView } from "../../providers/auth-view-provider";
import { HPL_SPORTS } from "../../config/sports";
import { Lock } from "lucide-react";

export interface MatchFormProps {
  teams: Team[];
  initialData?: Partial<Match>;
  onSubmit: (data: {
    sportId: SportId;
    teamAId: string;
    teamBId: string;
    startTime: string;
    venue: string;
    round: string;
    refereeUmpire: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MatchForm: React.FC<MatchFormProps> = ({
  initialData,
  teams,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { role, assignedSportIds } = useAuthView();
  const isSportLocked = role === "sport_admin" && assignedSportIds.length > 0;
  const defaultSport = isSportLocked ? assignedSportIds[0] : initialData?.sportId || "cricket";

  const [sportId, setSportId] = useState<SportId>(defaultSport);
  const [teamAId, setTeamAId] = useState(initialData?.teamAId || (teams[0]?.id || "team-arkavati"));
  const [teamBId, setTeamBId] = useState(initialData?.teamBId || (teams[1]?.id || "team-harangi"));
  const [startTime, setStartTime] = useState(
    initialData?.startTime ? initialData.startTime.slice(0, 16) : new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16)
  );
  const [venue, setVenue] = useState(initialData?.venue || "Main Sports Complex Oval");
  const [round, setRound] = useState(initialData?.round || "Group Stage");
  const [refereeUmpire, setRefereeUmpire] = useState(initialData?.refereeUmpire || "Prof. R. Narayanan");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isSportLocked) {
      setSportId(assignedSportIds[0]);
    }
  }, [isSportLocked, assignedSportIds]);

  const sportOptions = HPL_SPORTS.map((s) => ({ value: s.id, label: s.name }));

  const teamOptions = [
    ...teams.map((t) => ({ value: t.id, label: t.name })),
    { value: "bye", label: "Scheduled Bye (Rest Period)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateMatchForm(
      { teamAId, teamBId, startTime: new Date(startTime).toISOString(), venue, round, refereeUmpire },
      !initialData?.id
    );
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onSubmit({
      sportId: isSportLocked ? assignedSportIds[0] : sportId,
      teamAId,
      teamBId,
      startTime: new Date(startTime).toISOString(),
      venue: venue.trim(),
      round: round.trim(),
      refereeUmpire: refereeUmpire.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSportLocked ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-white">Sport Discipline</label>
            <span
              className="inline-flex items-center gap-1 text-[11px] text-hpl-accent font-medium cursor-help"
              title="Locked to your assigned sport"
            >
              <Lock className="w-3 h-3" />
              Locked to your assigned sport
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

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="House A (Home)"
          value={teamAId}
          onChange={(e) => setTeamAId(e.target.value)}
          options={teamOptions.filter(t => t.value !== "bye")}
          error={errors.teamAId}
        />
        <Select
          label="House B (Away / Bye)"
          value={teamBId}
          onChange={(e) => setTeamBId(e.target.value)}
          options={teamOptions}
          error={errors.teamBId}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Scheduled Date & Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          error={errors.startTime}
          required
        />
        <Input
          label="Tournament Round"
          placeholder="e.g. Group Stage, Semi-Final"
          value={round}
          onChange={(e) => setRound(e.target.value)}
          error={errors.round}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Venue"
          placeholder="e.g. Main Complex Ground"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          error={errors.venue}
          required
        />
        <Input
          label="Referee / Umpire in Charge"
          placeholder="e.g. Prof. R. Narayanan"
          value={refereeUmpire}
          onChange={(e) => setRefereeUmpire(e.target.value)}
          error={errors.refereeUmpire}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-hpl-border">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading} className="shadow-glow">
          {initialData?.id ? "Update Fixture" : "Schedule Fixture"}
        </Button>
      </div>
    </form>
  );
};
