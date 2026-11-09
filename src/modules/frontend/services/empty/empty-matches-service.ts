import { Fixture, Match, MatchesService, MatchStatus, NotFoundError, SportId } from "../../types";

export class EmptyMatchesService implements MatchesService {
  private matches: Match[] = [];

  async getMatches(filter?: {
    sportId?: SportId;
    status?: MatchStatus;
    teamId?: string;
    date?: string;
    search?: string;
  }): Promise<Match[]> {
    let result = [...this.matches];
    if (filter?.sportId) result = result.filter((m) => m.sportId === filter.sportId);
    if (filter?.status) result = result.filter((m) => m.status === filter.status);
    if (filter?.teamId) result = result.filter((m) => m.teamAId === filter.teamId || m.teamBId === filter.teamId);
    return result;
  }

  async getMatchById(id: string): Promise<Match> {
    const m = this.matches.find((item) => item.id === id);
    if (!m) throw new NotFoundError("Match", id);
    return m;
  }

  async getFixtures(filter?: { sportId?: SportId; date?: string }): Promise<Fixture[]> {
    return [];
  }

  async createMatch(input: {
    sportId: SportId;
    teamAId: string;
    teamBId: string;
    startTime: string;
    venue: string;
    round: string;
    refereeUmpire: string;
  }): Promise<Match> {
    const newMatch: Match = {
      ...input,
      id: `match-${Date.now()}`,
      status: "upcoming",
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
        currentBattingTeamId: input.teamAId,
        currentBowlingTeamId: input.teamBId,
        batsmen: {},
        bowlers: {},
        recentBalls: [],
        totalOversAllowed: 20,
      },
      events: [],
      lastUpdated: new Date().toISOString(),
    };
    this.matches.push(newMatch);
    return newMatch;
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
    const idx = this.matches.findIndex((m) => m.id === id);
    if (idx === -1) {
      const match: Match = {
        id,
        sportId: updates.sportId || "cricket",
        teamAId: updates.teamAId || "AL",
        teamBId: updates.teamBId || "TT",
        venue: updates.venue || "Main Ground",
        startTime: updates.startTime || new Date().toISOString(),
        round: updates.round || "Group Stage",
        refereeUmpire: updates.refereeUmpire || "Official",
        status: updates.status || "live",
        scoreState: updates.scoreState || {
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
          currentBattingTeamId: updates.teamAId || "AL",
          currentBowlingTeamId: updates.teamBId || "TT",
          batsmen: {},
          bowlers: {},
          recentBalls: [],
          totalOversAllowed: 20,
        },
        events: updates.events || [],
        lastUpdated: new Date().toISOString(),
        ...updates,
      };
      this.matches.push(match);
      return match;
    }
    this.matches[idx] = { ...this.matches[idx], ...updates, lastUpdated: new Date().toISOString() };
    return this.matches[idx];
  }

  async updateMatchStatus(id: string, status: MatchStatus): Promise<Match> {
    return this.updateMatch(id, { status });
  }
}
