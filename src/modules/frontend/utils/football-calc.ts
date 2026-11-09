export function calculateGoalDifference(goalsFor: number, goalsAgainst: number): number {
  return goalsFor - goalsAgainst;
}

export function calculatePoints(wins: number, draws: number): number {
  return wins * 3 + draws;
}

export function formatMatchHalves(minute: number, extraTime = 0): string {
  if (extraTime > 0) {
    return `${minute}+${extraTime}'`;
  }
  return `${minute}'`;
}

export function normalizeRating(rawRating: number): string {
  const clamped = Math.max(1, Math.min(10, rawRating));
  return clamped.toFixed(1);
}

