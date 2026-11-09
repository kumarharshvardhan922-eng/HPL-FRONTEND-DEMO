import { MatchStatus, ScoreEvent, SportId } from "./domain";

export interface BatsmanScore {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalDetail?: string;
}

export interface BowlerScore {
  playerId: string;
  overs: number;
  balls: number; // additional balls in current over (0-5)
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
}

export interface CricketScoreState {
  sportId: "cricket";
  runsA: number;
  wicketsA: number;
  oversA: number;
  ballsA: number;
  extrasA: { wides: number; noBalls: number; byes: number; legByes: number; penalty: number };
  runsB: number;
  wicketsB: number;
  oversB: number;
  ballsB: number;
  extrasB: { wides: number; noBalls: number; byes: number; legByes: number; penalty: number };
  currentInnings: 1 | 2;
  currentBattingTeamId: string;
  currentBowlingTeamId: string;
  strikerId?: string;
  nonStrikerId?: string;
  currentBowlerId?: string;
  batsmen: Record<string, BatsmanScore>;
  bowlers: Record<string, BowlerScore>;
  recentBalls: string[]; // e.g. ["1", "4", "W", "0", "wd", "6"]
  totalOversAllowed: number;
  targetRuns?: number;
}

export interface FootballGoal {
  playerId: string;
  playerInitials: string;
  teamId: string;
  minute: number;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
}

export interface FootballScoreState {
  sportId: "football";
  goalsA: number;
  goalsB: number;
  currentHalf: 1 | 2 | "extra_time" | "penalties";
  matchTimeMinutes: number;
  extraTimeMinutes: number;
  possessionA: number;
  possessionB: number;
  shotsA: number;
  shotsB: number;
  shotsOnTargetA: number;
  shotsOnTargetB: number;
  cornersA: number;
  cornersB: number;
  foulsA: number;
  foulsB: number;
  yellowCardsA: number;
  yellowCardsB: number;
  redCardsA: number;
  redCardsB: number;
  goals: FootballGoal[];
  formationA: string; // e.g. "4-4-2"
  formationB: string; // e.g. "4-3-3"
  playerRatings: Record<string, number>; // ratings 0.0 to 10.0
}

export interface KabaddiPlayerStats {
  raidPoints: number;
  tacklePoints: number;
  bonusPoints: number;
  totalPoints: number;
}

export interface KabaddiScoreState {
  sportId: "kabaddi";
  scoreA: number;
  scoreB: number;
  raidPointsA: number;
  raidPointsB: number;
  tacklePointsA: number;
  tacklePointsB: number;
  bonusPointsA: number;
  bonusPointsB: number;
  allOutsA: number;
  allOutsB: number;
  currentHalf: 1 | 2;
  halfRemainingSeconds: number;
  activeRaiderTeamId?: string;
  activeRaiderId?: string;
  isDoOrDieRaid: boolean;
  playerStats: Record<string, KabaddiPlayerStats>;
}

export interface BadmintonGameScore {
  gameNumber: number;
  scoreA: number;
  scoreB: number;
  isCompleted: boolean;
  winnerTeamId?: string;
}

export interface BadmintonScoreState {
  sportId: "badminton";
  matchType: "singles" | "doubles";
  setsWonA: number;
  setsWonB: number;
  currentGame: number; // 1, 2, or 3
  currentScoreA: number;
  currentScoreB: number;
  games: BadmintonGameScore[];
  servingTeamId: string;
}

export interface VolleyballSetScore {
  setNumber: number;
  scoreA: number;
  scoreB: number;
  isCompleted: boolean;
  winnerTeamId?: string;
}

export interface VolleyballScoreState {
  sportId: "volleyball";
  setsWonA: number;
  setsWonB: number;
  currentSet: number; // 1 to 5
  currentScoreA: number;
  currentScoreB: number;
  sets: VolleyballSetScore[];
  servingTeamId: string;
  timeoutsRemainingA: number;
  timeoutsRemainingB: number;
  rotationA: number; // 1 to 6
  rotationB: number;
}

export interface BasketballPlayerStats {
  points: number;
  fouls: number;
  rebounds: number;
  assists: number;
}

export interface BasketballScoreState {
  sportId: "basketball";
  scoreA: number;
  scoreB: number;
  currentQuarter: 1 | 2 | 3 | 4 | "OT";
  quarterTimeRemainingSeconds: number; // e.g. 600 for 10 min
  teamFoulsA: number;
  teamFoulsB: number;
  isBonusA: boolean;
  isBonusB: boolean;
  timeoutsRemainingA: number;
  timeoutsRemainingB: number;
  quarterScores: { quarter: string; scoreA: number; scoreB: number }[];
  playerStats: Record<string, BasketballPlayerStats>;
}

export type AnySportScoreState =
  | CricketScoreState
  | FootballScoreState
  | KabaddiScoreState
  | BadmintonScoreState
  | VolleyballScoreState
  | BasketballScoreState;

export interface Match {
  id: string;
  sportId: SportId;
  teamAId: string;
  teamBId: string;
  status: MatchStatus;
  startTime: string; // ISO 8601
  endTime?: string;
  venue: string;
  round: string;
  refereeUmpire: string;
  tossWinnerTeamId?: string;
  tossDecision?: "bat" | "bowl" | "serve" | "side";
  resultSummary?: string; // e.g. "Red Hostel won by 6 wickets"
  scoreState: AnySportScoreState;
  events: ScoreEvent[];
  lastUpdated: string; // ISO timestamp
}

