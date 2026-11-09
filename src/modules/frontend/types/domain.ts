export type Role = "super_admin" | "sport_admin" | "public";

export type SportId =
  | "cricket"
  | "football"
  | "kabaddi"
  | "badminton"
  | "volleyball"
  | "basketball";

export interface Sport {
  id: SportId;
  name: string;
  icon: string;
  description: string;
  rulesSummary: string;
  activeMatchesCount: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  assignedSportIds?: SportId[]; // Only applicable for sport_admin
}

export interface Team {
  id: string;
  name: string; // e.g. "Red Hostel", "Blue Hostel"
  shortName: string; // e.g. "RED", "BLU"
  hostelBlock: string; // e.g. "Block A", "Block B"
  primaryColor: string; // hex code
  secondaryColor: string;
  logoUrl?: string;
  captainId?: string;
  playerIds: string[];
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  jerseyNumber: number;
  sportId: SportId;
  role: string; // e.g. "Batsman", "Striker", "Raider", "Setter", "Guard"
  photoPlaceholderUrl?: string;
  stats?: Record<string, number | string>;
}

export type MatchStatus = "upcoming" | "live" | "completed" | "abandoned";

export interface Fixture {
  id: string;
  matchId: string;
  sportId: SportId;
  teamAId: string;
  teamBId: string;
  round: string; // e.g. "Group Stage", "Semi-Final", "Final"
  scheduledStartTime: string; // ISO 8601 string
  venue: string; // e.g. "Main Sports Complex", "Hostel Ground 2"
}

export interface ScoreEvent {
  id: string;
  matchId: string;
  sportId: SportId;
  timestamp: string; // ISO or match minute
  displayTime: string; // e.g. "45+2'", "18.4 ov", "Q3 04:12"
  eventType: string; // e.g. "wicket", "six", "goal", "yellow_card", "super_raid"
  teamId: string;
  playerId?: string;
  detail: string;
  isUndoable?: boolean;
}

export interface Standing {
  teamId: string;
  teamName: string;
  sportId: SportId;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  netRunRate?: number; // Cricket
  goalDifference?: number; // Football
  scoreDifference?: number; // Kabaddi, Basketball, Badminton, Volleyball
  form: ("W" | "L" | "D" | "T")[];
}

