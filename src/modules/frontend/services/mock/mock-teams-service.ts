import { NotFoundError, Team, TeamsService, ValidationError } from "../../types";
import { MOCK_TEAMS } from "../../mocks/teams-players-data";
import { deepClone, simulateLatency } from "./mock-utils";

export class MockTeamsService implements TeamsService {
  private teams: Team[] = deepClone(MOCK_TEAMS);

  async getTeams(filter?: { search?: string }): Promise<Team[]> {
    await simulateLatency();
    let result = deepClone(this.teams);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q) || t.hostelBlock.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getTeamById(id: string): Promise<Team> {
    await simulateLatency();
    const team = this.teams.find((t) => t.id === id);
    if (!team) {
      throw new NotFoundError("Team", id);
    }
    return deepClone(team);
  }

  async createTeam(input: Omit<Team, "id">): Promise<Team> {
    await simulateLatency();
    if (!input.name || input.name.trim().length < 2) {
      throw new ValidationError("Team name must be at least 2 characters.", { name: "Name is too short" });
    }
    const newTeam: Team = {
      ...input,
      id: `team-${Date.now()}`,
      playerIds: input.playerIds || [],
    };
    this.teams.push(newTeam);
    return deepClone(newTeam);
  }

  async updateTeam(id: string, input: Partial<Team>): Promise<Team> {
    await simulateLatency();
    const index = this.teams.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundError("Team", id);
    }
    this.teams[index] = { ...this.teams[index], ...input };
    return deepClone(this.teams[index]);
  }

  async deleteTeam(id: string): Promise<void> {
    await simulateLatency();
    const index = this.teams.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundError("Team", id);
    }
    this.teams.splice(index, 1);
  }
}

