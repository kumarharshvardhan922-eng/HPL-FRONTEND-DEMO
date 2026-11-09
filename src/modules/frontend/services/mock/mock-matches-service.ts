import { Fixture, Match, MatchesService, MatchStatus, NotFoundError, SportId, ValidationError } from "../../types";
import { MOCK_MATCHES } from "../../mocks/matches-registry";
import { deepClone, simulateLatency } from "./mock-utils";

export class MockMatchesService implements MatchesService {
  private matches: Match[] = deepClone(MOCK_MATCHES);

  async getMatches(filter?: {
    sportId?: SportId;
    status?: MatchStatus;
    teamId?: string;
    date?: string;
    search?: string;
  }): Promise<Match[]> {
    await simulateLatency();
    let result = deepClone(this.matches);
    if (filter?.sportId) {
      result = result.filter((m) => m.sportId === filter.sportId);
    }
    if (filter?.status) {
      result = result.filter((m) => m.status === filter.status);
    }
    if (filter?.teamId) {
      result = result.filter((m) => m.teamAId === filter.teamId || m.teamBId === filter.teamId);
    }
    if (filter?.date) {
      result = result.filter((m) => m.startTime.startsWith(filter.date!));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.round.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q) ||
          m.teamAId.toLowerCase().includes(q) ||
          m.teamBId.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getMatchById(id: string): Promise<Match> {
    await simulateLatency();
    const match = this.matches.find((m) => m.id === id);
    if (!match) {
      throw new NotFoundError("Match", id);
    }
    return deepClone(match);
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
    await simulateLatency();
    if (input.teamAId === input.teamBId) {
      throw new ValidationError("Competing teams must be distinct.", { teamBId: "Teams must differ" });
    }
    const newMatch: Match = {
      id: `match-${input.sportId}-${Date.now()}`,
      sportId: input.sportId,
      teamAId: input.teamAId,
      teamBId: input.teamBId,
      status: "upcoming",
      startTime: input.startTime,
      venue: input.venue,
      round: input.round,
      refereeUmpire: input.refereeUmpire,
      scoreState: deepClone(MOCK_MATCHES[0].scoreState),
      events: [],
      lastUpdated: new Date().toISOString(),
    };
    this.matches.unshift(newMatch);
    return deepClone(newMatch);
  }

  async updateMatch(id: string, input: Partial<Match>): Promise<Match> {
    await simulateLatency();
    const index = this.matches.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundError("Match", id);
    }
    this.matches[index] = { ...this.matches[index], ...input, lastUpdated: new Date().toISOString() };
    return deepClone(this.matches[index]);
  }

  async updateMatchStatus(id: string, status: MatchStatus): Promise<Match> {
    return this.updateMatch(id, { status });
  }

  async getFixtures(filter?: { sportId?: SportId; date?: string }): Promise<Fixture[]> {
    await simulateLatency();
    let matches = deepClone(this.matches);
    if (filter?.sportId) {
      matches = matches.filter((m) => m.sportId === filter.sportId);
    }
    if (filter?.date) {
      matches = matches.filter((m) => m.startTime.startsWith(filter.date!));
    }
    return matches.map((m) => ({
      id: `fix-${m.id}`,
      matchId: m.id,
      sportId: m.sportId,
      teamAId: m.teamAId,
      teamBId: m.teamBId,
      round: m.round,
      scheduledStartTime: m.startTime,
      venue: m.venue,
    }));
  }
}

