import { Fixture, Match, MatchesService, MatchStatus, NotFoundError, SportId } from "../../types";
import { SHOWCASE_MATCH } from "../../showcase/showcase";

export class DemoMatchesService implements MatchesService {
  private matches: Match[] = [{ ...SHOWCASE_MATCH }];

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
    const match = this.matches.find((m) => m.id === id);
    if (!match) throw new NotFoundError("Match", id);
    return { ...match };
  }

  async getFixtures(filter?: { sportId?: SportId; date?: string }): Promise<Fixture[]> {
    const m = this.matches[0];
    if (!m) return [];
    if (filter?.sportId && filter.sportId !== m.sportId) return [];
    return [
      {
        id: "fixture-demo-1",
        matchId: m.id,
        sportId: m.sportId,
        teamAId: m.teamAId,
        teamBId: m.teamBId,
        round: m.round,
        scheduledStartTime: m.startTime,
        venue: m.venue,
        isDemo: true,
      },
    ];
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
      scoreState: { ...SHOWCASE_MATCH.scoreState },
      events: [],
      lastUpdated: new Date().toISOString(),
      isDemo: true,
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
        scoreState: updates.scoreState || { ...SHOWCASE_MATCH.scoreState },
        events: updates.events || [],
        lastUpdated: new Date().toISOString(),
        isDemo: true,
        ...updates,
      };
      this.matches.push(match);
      return match;
    }
    this.matches[idx] = { ...this.matches[idx], ...updates, isDemo: true, lastUpdated: new Date().toISOString() };
    return this.matches[idx];
  }

  async updateMatchStatus(id: string, status: MatchStatus): Promise<Match> {
    return this.updateMatch(id, { status });
  }
}
