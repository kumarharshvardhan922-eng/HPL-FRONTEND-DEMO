import { NotFoundError, Player, PlayersService, SportId } from "../../types";

export class EmptyPlayersService implements PlayersService {
  private players: Player[] = [];

  async getPlayers(filter?: { teamId?: string; sportId?: SportId; role?: string }): Promise<Player[]> {
    let result = [...this.players];
    if (filter?.teamId) result = result.filter((p) => p.teamId === filter.teamId);
    if (filter?.sportId) result = result.filter((p) => p.sportId === filter.sportId);
    if (filter?.role) result = result.filter((p) => p.role.toLowerCase().includes(filter.role!.toLowerCase()));
    return result;
  }

  async getPlayerById(id: string): Promise<Player> {
    const p = this.players.find((player) => player.id === id);
    if (!p) throw new NotFoundError("Player", id);
    return p;
  }

  async createPlayer(data: Omit<Player, "id">): Promise<Player> {
    const newPlayer: Player = { ...data, id: `player-${Date.now()}` };
    this.players.push(newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const idx = this.players.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Player ${id} not found`);
    this.players[idx] = { ...this.players[idx], ...updates };
    return this.players[idx];
  }

  async deletePlayer(id: string): Promise<void> {
    this.players = this.players.filter((p) => p.id !== id);
  }
}
