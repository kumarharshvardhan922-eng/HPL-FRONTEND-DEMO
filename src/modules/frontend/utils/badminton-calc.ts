export function checkGameWinner(scoreA: number, scoreB: number): "A" | "B" | null {
  // Cap at 30
  if (scoreA >= 30) return "A";
  if (scoreB >= 30) return "B";

  // Standard win to 21 by 2
  if (scoreA >= 21 && scoreA - scoreB >= 2) return "A";
  if (scoreB >= 21 && scoreB - scoreA >= 2) return "B";

  return null;
}

export function checkBadmintonMatchWinner(gamesWonA: number, gamesWonB: number): "A" | "B" | null {
  if (gamesWonA >= 2) return "A";
  if (gamesWonB >= 2) return "B";
  return null;
}
