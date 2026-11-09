import { Fixture, MatchStatus, Player, Role, ScoreEvent, Sport, SportId, Standing, Team, User } from "./domain";
import { AnySportScoreState, Match } from "./scoring";

export class ServiceError extends Error {
  constructor(message: string, public code: string = "SERVICE_ERROR", public status: number = 500) {
    super(message);
    this.name = "ServiceError";
  }
}

export class NotFoundError extends ServiceError {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' was not found.`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string, public fieldErrors?: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export interface SportsService {
  getSports(): Promise<Sport[]>;
  getSportById(id: SportId): Promise<Sport>;
}

export interface TeamsService {
  getTeams(filter?: { search?: string }): Promise<Team[]>;
  getTeamById(id: string): Promise<Team>;
  createTeam(input: Omit<Team, "id">): Promise<Team>;
  updateTeam(id: string, input: Partial<Team>): Promise<Team>;
  deleteTeam(id: string): Promise<void>;
}

export interface PlayersService {
  getPlayers(filter?: { teamId?: string; sportId?: SportId; search?: string }): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player>;
  createPlayer(input: Omit<Player, "id">): Promise<Player>;
  updatePlayer(id: string, input: Partial<Player>): Promise<Player>;
  deletePlayer(id: string): Promise<void>;
}

export interface MatchesService {
  getMatches(filter?: {
    sportId?: SportId;
    status?: MatchStatus;
    teamId?: string;
    date?: string;
    search?: string;
  }): Promise<Match[]>;
  getMatchById(id: string): Promise<Match>;
  createMatch(input: {
    sportId: SportId;
    teamAId: string;
    teamBId: string;
    startTime: string;
    venue: string;
    round: string;
    refereeUmpire: string;
  }): Promise<Match>;
  updateMatch(id: string, input: Partial<Match>): Promise<Match>;
  updateMatchStatus(id: string, status: MatchStatus): Promise<Match>;
  getFixtures(filter?: { sportId?: SportId; date?: string }): Promise<Fixture[]>;
}

export interface ScoringService {
  recordEvent(matchId: string, event: Omit<ScoreEvent, "id" | "timestamp">): Promise<{ match: Match; event: ScoreEvent }>;
  undoLastEvent(matchId: string): Promise<Match>;
  manualOverrideScore(matchId: string, newScoreState: AnySportScoreState, reason: string): Promise<Match>;
  subscribeLiveMatch(matchId: string, callback: (match: Match) => void): () => void;
}

export interface StandingsService {
  getStandings(sportId: SportId): Promise<Standing[]>;
}

export interface AuthViewService {
  getCurrentUser(): Promise<User>;
  setRole(role: Role, assignedSportIds?: SportId[]): Promise<User>;
  getAdmins(): Promise<User[]>;
  inviteAdmin(input: { email: string; displayName: string; role: Role; assignedSportIds?: SportId[] }): Promise<User>;
}

