import { NotFoundError, Player, PlayersService, SportId, ValidationError } from "../../types";
import { MOCK_PLAYERS } from "../../mocks/teams-players-data";
import { deepClone, simulateLatency } from "./mock-utils";

export class MockPlayersService implements PlayersService {
  private players: Player[] = deepClone(MOCK_PLAYERS);

  async getPlayers(filter?: { teamId?: string; sportId?: SportId; search?: string }): Promise<Player[]> {
    await simulateLatency();
    let result = deepClone(this.players);
    if (filter?.teamId) {
      result = result.filter((p) => p.teamId === filter.teamId);
    }
    if (filter?.sportId) {
      result = result.filter((p) => p.sportId === filter.sportId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || String(p.jerseyNumber) === q
      );
    }
    return result;
  }

  async getPlayerById(id: string): Promise<Player> {
    await simulateLatency();
    const player = this.players.find((p) => p.id === id);
    if (!player) {
      throw new NotFoundError("Player", id);
    }
    return deepClone(player);
  }

  async createPlayer(input: Omit<Player, "id">): Promise<Player> {
    await simulateLatency();
    if (!input.name || input.name.trim().length < 2) {
      throw new ValidationError("Player name must be at least 2 characters.", { name: "Name too short" });
    }
    const newPlayer: Player = {
      ...input,
      id: `p-${Date.now()}`,
    };
    this.players.push(newPlayer);
    return deepClone(newPlayer);
  }

  async updatePlayer(id: string, input: Partial<Player>): Promise<Player> {
    await simulateLatency();
    const index = this.players.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError("Player", id);
    }
    this.players[index] = { ...this.players[index], ...input };
    return deepClone(this.players[index]);
  }

  async deletePlayer(id: string): Promise<void> {
    await simulateLatency();
    const index = this.players.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError("Player", id);
    }
    this.players.splice(index, 1);
  }
}

