import { AnySportScoreState, Match, ScoreEvent, ScoringService } from "../../types";

export class EmptyScoringService implements ScoringService {
  async recordEvent(matchId: string, event: Omit<ScoreEvent, "id" | "timestamp">): Promise<{ match: Match; event: ScoreEvent }> {
    const fullEvent: ScoreEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const dummyMatch: Match = {
      id: matchId,
      sportId: "cricket",
      teamAId: "AL",
      teamBId: "TT",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Main Ground",
      round: "Group Stage",
      refereeUmpire: "Official",
      scoreState: {
        sportId: "cricket",
        runsA: 0,
        wicketsA: 0,
        oversA: 0,
        ballsA: 0,
        extrasA: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
        runsB: 0,
        wicketsB: 0,
        oversB: 0,
        ballsB: 0,
        extrasB: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
        currentInnings: 1,
        currentBattingTeamId: "AL",
        currentBowlingTeamId: "TT",
        batsmen: {},
        bowlers: {},
        recentBalls: [],
        totalOversAllowed: 20,
      },
      events: [fullEvent],
      lastUpdated: new Date().toISOString(),
    };
    return { match: dummyMatch, event: fullEvent };
  }

  async undoLastEvent(matchId: string): Promise<Match> {
    throw new Error("No events recorded for this match.");
  }

  async manualOverrideScore(matchId: string, scoreState: AnySportScoreState, reason: string): Promise<Match> {
    throw new Error("Match not found.");
  }

  subscribeLiveMatch(matchId: string, callback: (match: Match) => void): () => void {
    return () => {};
  }
}
