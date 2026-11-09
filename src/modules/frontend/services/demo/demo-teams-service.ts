import { NotFoundError, Team, TeamsService } from "../../types";
import { SHOWCASE_TEAMS } from "../../showcase/showcase";

export class DemoTeamsService implements TeamsService {
  private teams: Team[] = [...SHOWCASE_TEAMS];

  async getTeams(): Promise<Team[]> {
    return [...this.teams];
  }

  async getTeamById(id: string): Promise<Team> {
    const t = this.teams.find((team) => team.id === id);
    if (!t) throw new NotFoundError("Team", id);
    return t;
  }

  async createTeam(data: Omit<Team, "id">): Promise<Team> {
    const newTeam: Team = { ...data, id: `team-${Date.now()}`, isDemo: true };
    this.teams.push(newTeam);
    return newTeam;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    const idx = this.teams.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Team ${id} not found`);
    this.teams[idx] = { ...this.teams[idx], ...updates, isDemo: true };
    return this.teams[idx];
  }

  async deleteTeam(id: string): Promise<void> {
    this.teams = this.teams.filter((t) => t.id !== id);
  }
}
