export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateTeamForm(input: {
  name: string;
  shortName: string;
  hostelBlock: string;
  primaryColor?: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};
  if (!input.name || input.name.trim().length < 2) {
    errors.name = "Team name must be at least 2 characters.";
  }
  if (!input.shortName || input.shortName.trim().length < 2 || input.shortName.trim().length > 5) {
    errors.shortName = "Short name must be 2 to 5 characters.";
  }
  if (!input.hostelBlock || input.hostelBlock.trim().length < 2) {
    errors.hostelBlock = "Hostel block is required.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePlayerForm(input: {
  name: string;
  jerseyNumber: number | string;
  role: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};
  if (!input.name || input.name.trim().length < 2) {
    errors.name = "Player name must be at least 2 characters.";
  }
  const jNum = Number(input.jerseyNumber);
  if (isNaN(jNum) || jNum < 0 || jNum > 99) {
    errors.jerseyNumber = "Jersey number must be between 0 and 99.";
  }
  if (!input.role || input.role.trim().length < 2) {
    errors.role = "Player role is required.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateMatchForm(
  input: {
    teamAId: string;
    teamBId: string;
    startTime: string;
    venue: string;
    round: string;
    refereeUmpire?: string;
  },
  isNew = false
): FormValidationResult {
  const errors: Record<string, string> = {};
  if (!input.teamAId) {
    errors.teamAId = "Team A is required.";
  }
  if (!input.teamBId) {
    errors.teamBId = "Team B is required.";
  }
  if (input.teamAId && input.teamBId && input.teamAId === input.teamBId) {
    errors.teamBId = "Competing teams must be distinct.";
  }
  if (!input.startTime) {
    errors.startTime = "Start time is required.";
  } else if (isNew) {
    const d = new Date(input.startTime);
    // Allow small margin of 2 mins for clock drift
    if (d.getTime() < Date.now() - 2 * 60 * 1000) {
      errors.startTime = "Start time cannot be in the past for new matches.";
    }
  }
  if (!input.venue || input.venue.trim().length < 2) {
    errors.venue = "Venue location is required.";
  }
  if (!input.round || input.round.trim().length < 2) {
    errors.round = "Tournament round is required.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateAdminInvite(input: { email: string; displayName: string }): FormValidationResult {
  const errors: Record<string, string> = {};
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!input.displayName || input.displayName.trim().length < 2) {
    errors.displayName = "Display name must be at least 2 characters.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateScoreOverride(reason: string): FormValidationResult {
  const errors: Record<string, string> = {};
  if (!reason || reason.trim().length < 5) {
    errors.reason = "Override reason must be at least 5 characters.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

