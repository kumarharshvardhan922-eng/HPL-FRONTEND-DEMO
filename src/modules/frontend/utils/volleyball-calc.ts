export function checkSetWinner(setNumber: number, scoreA: number, scoreB: number): "A" | "B" | null {
  const target = setNumber === 5 ? 15 : 25;
  if (scoreA >= target && scoreA - scoreB >= 2) return "A";
  if (scoreB >= target && scoreB - scoreA >= 2) return "B";
  return null;
}

export function checkVolleyballMatchWinner(setsWonA: number, setsWonB: number): "A" | "B" | null {
  if (setsWonA >= 3) return "A";
  if (setsWonB >= 3) return "B";
  return null;
}
