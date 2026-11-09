export function oversToBalls(overs: number, balls: number): number {
  return Math.max(0, overs * 6 + balls);
}

export function ballsToOvers(totalBalls: number): { overs: number; balls: number; display: string } {
  const safeBalls = Math.max(0, Math.floor(totalBalls));
  const overs = Math.floor(safeBalls / 6);
  const remBalls = safeBalls % 6;
  return {
    overs,
    balls: remBalls,
    display: `${overs}.${remBalls}`,
  };
}

export function addBallToOvers(currentOvers: number, currentBalls: number): { overs: number; balls: number; display: string } {
  const nextBalls = currentBalls + 1;
  if (nextBalls >= 6) {
    return {
      overs: currentOvers + 1,
      balls: 0,
      display: `${currentOvers + 1}.0`,
    };
  }
  return {
    overs: currentOvers,
    balls: nextBalls,
    display: `${currentOvers}.${nextBalls}`,
  };
}

export function calculateRunRate(runs: number, overs: number, balls: number): number {
  const totalBalls = oversToBalls(overs, balls);
  if (totalBalls === 0) return 0;
  const rate = (runs / totalBalls) * 6;
  return Number(rate.toFixed(2));
}

export function calculateRequiredRunRate(
  target: number,
  currentRuns: number,
  totalOvers: number,
  currentOvers: number,
  currentBalls: number
): number | null {
  const runsNeeded = target - currentRuns;
  if (runsNeeded <= 0) return 0;

  const totalBallsAllowed = totalOvers * 6;
  const bowledBalls = oversToBalls(currentOvers, currentBalls);
  const ballsRemaining = totalBallsAllowed - bowledBalls;

  if (ballsRemaining <= 0) return null; // Innings over
  const rrr = (runsNeeded / ballsRemaining) * 6;
  return Number(rrr.toFixed(2));
}

export function calculateStrikeRate(runs: number, balls: number): number {
  if (balls <= 0) return 0;
  return Number(((runs / balls) * 100).toFixed(2));
}

export function calculateEconomy(runsConceded: number, overs: number, balls: number): number {
  const totalBalls = oversToBalls(overs, balls);
  if (totalBalls === 0) return 0;
  return Number(((runsConceded / totalBalls) * 6).toFixed(2));
}

export function calculateNetRunRate(
  runsScored: number,
  oversFaced: number,
  ballsFaced: number,
  runsConceded: number,
  oversBowled: number,
  ballsBowled: number
): number {
  const totalBallsFaced = oversToBalls(oversFaced, ballsFaced);
  const totalBallsBowled = oversToBalls(oversBowled, ballsBowled);

  const scoringRate = totalBallsFaced > 0 ? (runsScored / totalBallsFaced) * 6 : 0;
  const concedingRate = totalBallsBowled > 0 ? (runsConceded / totalBallsBowled) * 6 : 0;

  return Number((scoringRate - concedingRate).toFixed(3));
}

