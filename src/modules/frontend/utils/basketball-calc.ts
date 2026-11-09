export function isBonusSituation(teamFouls: number): boolean {
  return teamFouls >= 5;
}

export function formatGameClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
}

export function calculateBasketballTotal(points1: number, points2: number, points3: number): number {
  return points1 * 1 + points2 * 2 + points3 * 3;
}

