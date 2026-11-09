"use client";

import React, { useState } from "react";
import { Team } from "../../types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { validateTeamForm } from "../../utils/validators";

export interface TeamFormProps {
  initialData?: Partial<Team>;
  onSubmit: (data: Omit<Team, "id">) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [shortName, setShortName] = useState(initialData?.shortName || "");
  const [hostelBlock, setHostelBlock] = useState(initialData?.hostelBlock || "");
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#38b6ff");
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || "#8fd8ff");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTeamForm({ name, shortName, hostelBlock, primaryColor });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onSubmit({
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      hostelBlock: hostelBlock.trim(),
      primaryColor,
      secondaryColor,
      playerIds: initialData?.playerIds || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="House Name"
        placeholder="e.g. Arkavati Lions"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="House Code (2-5 letters)"
          placeholder="e.g. AL"
          value={shortName}
          onChange={(e) => setShortName(e.target.value.toUpperCase())}
          error={errors.shortName}
          required
        />
        <Input
          label="House Block"
          placeholder="e.g. Block A - Arkavati"
          value={hostelBlock}
          onChange={(e) => setHostelBlock(e.target.value)}
          error={errors.hostelBlock}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs sm:text-sm font-semibold text-white">Primary Brand Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-hpl-border bg-hpl-surface-2"
            />
            <span className="text-xs font-mono text-hpl-accent">{primaryColor}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs sm:text-sm font-semibold text-white">Accent Brand Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-hpl-border bg-hpl-surface-2"
            />
            <span className="text-xs font-mono text-hpl-accent-soft">{secondaryColor}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-hpl-border">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading} className="shadow-glow">
          {initialData?.name ? "Update House" : "Create House"}
        </Button>
      </div>
    </form>
  );
};
