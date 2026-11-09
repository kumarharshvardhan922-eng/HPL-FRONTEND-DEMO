"use client";

import React, { useState } from "react";
import { Role, SportId } from "../../types";
import { HPL_SPORTS } from "../../config/sports";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { validateAdminInvite } from "../../utils/validators";

export interface AdminInviteFormProps {
  onSubmit: (data: {
    email: string;
    displayName: string;
    role: Role;
    assignedSportIds: SportId[];
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AdminInviteForm: React.FC<AdminInviteFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("sport_admin");
  const [selectedSport, setSelectedSport] = useState<SportId>("cricket");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions = [
    { value: "sport_admin", label: "Sport Admin (Scoped Access)" },
    { value: "super_admin", label: "Super Admin (Full Access)" },
  ];

  const sportOptions = HPL_SPORTS.map((s) => ({ value: s.id, label: s.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAdminInvite({ email, displayName });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onSubmit({
      email: email.trim(),
      displayName: displayName.trim(),
      role,
      assignedSportIds: role === "sport_admin" ? [selectedSport] : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Admin Email Address"
        type="email"
        placeholder="e.g. sports.incharge@hpl.ac.in"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />

      <Input
        label="Display Name"
        placeholder="e.g. Dr. K. Ramesh"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        error={errors.displayName}
        required
      />

      <Select
        label="Administrative Role"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        options={roleOptions}
      />

      {role === "sport_admin" && (
        <Select
          label="Assigned Sport Discipline"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value as SportId)}
          options={sportOptions}
        />
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-hpl-border">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading} className="shadow-glow">
          Send Invitation
        </Button>
      </div>
    </form>
  );
};
