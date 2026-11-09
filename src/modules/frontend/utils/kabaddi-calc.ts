export function calculateTotalScore(
  raidPoints: number,
  tacklePoints: number,
  bonusPoints: number,
  allOuts: number
): number {
  return raidPoints + tacklePoints + bonusPoints + allOuts * 2;
}

export function isSuperRaid(pointsEarnedInRaid: number): boolean {
  return pointsEarnedInRaid >= 3;
}

export function isSuperTackle(defendersOnMat: number): boolean {
  return defendersOnMat > 0 && defendersOnMat <= 3;
}

