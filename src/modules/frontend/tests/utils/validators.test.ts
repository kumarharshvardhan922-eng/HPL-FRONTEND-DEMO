import { describe, it, expect } from "vitest";
import {
  validateTeamForm,
  validatePlayerForm,
  validateMatchForm,
  validateAdminInvite,
  validateScoreOverride,
} from "../../utils/validators";

describe("Form Validators", () => {
  it("validates team form with real house data", () => {
    const valid = validateTeamForm({ name: "Arkavati Lions", shortName: "AL", hostelBlock: "Block A - Arkavati" });
    expect(valid.isValid).toBe(true);

    const invalid = validateTeamForm({ name: "A", shortName: "TOOLONGNAME", hostelBlock: "" });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.name).toBeDefined();
    expect(invalid.errors.shortName).toBeDefined();
    expect(invalid.errors.hostelBlock).toBeDefined();
  });

  it("validates player form", () => {
    const valid = validatePlayerForm({ name: "Aarav Sharma", jerseyNumber: 7, role: "Batsman" });
    expect(valid.isValid).toBe(true);

    const invalid = validatePlayerForm({ name: "", jerseyNumber: 105, role: "" });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.name).toBeDefined();
    expect(invalid.errors.jerseyNumber).toBeDefined();
    expect(invalid.errors.role).toBeDefined();
  });

  it("validates match form and prevents same teams or past dates", () => {
    const futureDate = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const valid = validateMatchForm({
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      startTime: futureDate,
      venue: "Ground 1",
      round: "Semi-Final",
    });
    expect(valid.isValid).toBe(true);

    const sameTeams = validateMatchForm({
      teamAId: "team-arkavati",
      teamBId: "team-arkavati", // Same team!
      startTime: futureDate,
      venue: "Ground 1",
      round: "Final",
    });
    expect(sameTeams.isValid).toBe(false);
    expect(sameTeams.errors.teamBId).toContain("distinct");

    const pastDate = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const pastMatch = validateMatchForm(
      {
        teamAId: "team-arkavati",
        teamBId: "team-harangi",
        startTime: pastDate,
        venue: "Ground 1",
        round: "Group",
      },
      true // isNew
    );
    expect(pastMatch.isValid).toBe(false);
    expect(pastMatch.errors.startTime).toContain("past");
  });

  it("validates admin invite and override reason", () => {
    expect(validateAdminInvite({ email: "invalid-email", displayName: "" }).isValid).toBe(false);
    expect(validateAdminInvite({ email: "admin@hpl.ac.in", displayName: "Dr. Rao" }).isValid).toBe(true);

    expect(validateScoreOverride("").isValid).toBe(false);
    expect(validateScoreOverride("abc").isValid).toBe(false);
    expect(validateScoreOverride("Umpire corrected boundary decision").isValid).toBe(true);
  });
});
