import { CricketScoreState, Match, Player, Standing, Team } from "../types";
import { HPL_HOUSES } from "../config/houses";

// 11 Clearly-labelled squad players for Arkavati Lions (Demo)
export const SHOWCASE_PLAYERS_A: Player[] = Array.from({ length: 11 }, (_, i) => ({
  id: `p-al-demo-${i + 1}`,
  teamId: "team-arkavati",
  name: `Arkavati Athlete ${i + 1}`,
  jerseyNumber: i + 1,
  sportId: "cricket",
  role: i === 0 ? "Captain & All-Rounder" : i < 5 ? "Batsman" : i === 5 ? "Wicketkeeper" : "Bowler",
  photoPlaceholderUrl: "",
  stats: {
    matches: 1,
    runs: i === 0 ? 45 : i === 1 ? 32 : 12,
    wickets: i === 0 ? 2 : i > 6 ? 1 : 0,
    mvpAwards: i === 0 ? 1 : 0,
  },
  isDemo: true,
}));

// 11 Clearly-labelled squad players for Tons Tigers (Demo)
export const SHOWCASE_PLAYERS_B: Player[] = Array.from({ length: 11 }, (_, i) => ({
  id: `p-tt-demo-${i + 1}`,
  teamId: "team-tons",
  name: `Tons Athlete ${i + 1}`,
  jerseyNumber: i + 1,
  sportId: "cricket",
  role: i === 0 ? "Captain & Bowler" : i < 5 ? "Batsman" : i === 5 ? "Wicketkeeper" : "Bowler",
  photoPlaceholderUrl: "",
  stats: {
    matches: 1,
    runs: i === 1 ? 40 : 10,
    wickets: i === 0 ? 2 : 0,
    mvpAwards: 0,
  },
  isDemo: true,
}));

export const SHOWCASE_PLAYERS: Player[] = [...SHOWCASE_PLAYERS_A, ...SHOWCASE_PLAYERS_B];

// Teams with demo squad IDs assigned
export const SHOWCASE_TEAMS: Team[] = HPL_HOUSES.map((h) => {
  if (h.id === "team-arkavati") {
    return { ...h, playerIds: SHOWCASE_PLAYERS_A.map((p) => p.id), isDemo: true };
  }
  if (h.id === "team-tons") {
    return { ...h, playerIds: SHOWCASE_PLAYERS_B.map((p) => p.id), isDemo: true };
  }
  return { ...h, isDemo: true };
});

const SHOWCASE_CRICKET_STATE: CricketScoreState = {
  sportId: "cricket",
  runsA: 165,
  wicketsA: 4,
  oversA: 20,
  ballsA: 0,
  extrasA: { wides: 4, noBalls: 1, byes: 2, legByes: 1, penalty: 0 },
  runsB: 150,
  wicketsB: 8,
  oversB: 20,
  ballsB: 0,
  extrasB: { wides: 3, noBalls: 0, byes: 1, legByes: 2, penalty: 0 },
  currentInnings: 2,
  currentBattingTeamId: "team-tons",
  currentBowlingTeamId: "team-arkavati",
  strikerId: "p-tt-demo-8",
  nonStrikerId: "p-tt-demo-9",
  currentBowlerId: "p-al-demo-1",
  batsmen: {
    "p-al-demo-1": { playerId: "p-al-demo-1", runs: 45, balls: 28, fours: 5, sixes: 2, strikeRate: 160.71, isOut: false },
    "p-al-demo-2": { playerId: "p-al-demo-2", runs: 32, balls: 24, fours: 3, sixes: 1, strikeRate: 133.33, isOut: true, dismissalDetail: "c Tons Athlete 1 b Tons Athlete 7" },
    "p-tt-demo-1": { playerId: "p-tt-demo-1", runs: 22, balls: 16, fours: 2, sixes: 1, strikeRate: 137.5, isOut: true, dismissalDetail: "b Arkavati Athlete 1" },
    "p-tt-demo-2": { playerId: "p-tt-demo-2", runs: 40, balls: 30, fours: 4, sixes: 1, strikeRate: 133.33, isOut: true, dismissalDetail: "run out (Arkavati Athlete 3)" },
  },
  bowlers: {
    "p-al-demo-1": { playerId: "p-al-demo-1", overs: 4, balls: 0, maidens: 0, runsConceded: 24, wickets: 2, economy: 6.0 },
    "p-tt-demo-1": { playerId: "p-tt-demo-1", overs: 4, balls: 0, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.0 },
  },
  recentBalls: ["1", "4", "W", "0", "1", "W"],
  totalOversAllowed: 20,
  targetRuns: 166,
};

// Exactly ONE showcase completed match
export const SHOWCASE_MATCH: Match = {
  id: "match-demo-showcase",
  sportId: "cricket",
  teamAId: "team-arkavati",
  teamBId: "team-tons",
  status: "completed",
  startTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  endTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  venue: "Main Sports Complex Oval",
  round: "Showcase Exhibition Match",
  refereeUmpire: "Official Tournament Umpire",
  tossWinnerTeamId: "team-arkavati",
  tossDecision: "bat",
  resultSummary: "Arkavati Lions won by 15 runs",
  scoreState: SHOWCASE_CRICKET_STATE,
  events: [
    {
      id: "ev-demo-1",
      matchId: "match-demo-showcase",
      sportId: "cricket",
      timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
      displayTime: "6.2 ov",
      eventType: "fifty_partnership",
      teamId: "team-arkavati",
      detail: "50-run opening stand reached in 38 balls.",
      isDemo: true,
    },
    {
      id: "ev-demo-2",
      matchId: "match-demo-showcase",
      sportId: "cricket",
      timestamp: new Date(Date.now() - 1.8 * 3600 * 1000).toISOString(),
      displayTime: "14.4 ov",
      eventType: "six",
      teamId: "team-arkavati",
      detail: "Massive six over mid-wicket by Arkavati Athlete 1.",
      isDemo: true,
    },
    {
      id: "ev-demo-3",
      matchId: "match-demo-showcase",
      sportId: "cricket",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      displayTime: "18.3 ov",
      eventType: "wicket",
      teamId: "team-arkavati",
      detail: "Crucial clean-bowled breakthrough by Arkavati Athlete 1.",
      isDemo: true,
    },
  ],
  lastUpdated: new Date().toISOString(),
  isDemo: true,
};

// Standings derived from the one showcase match
export const SHOWCASE_STANDINGS: Standing[] = HPL_HOUSES.map((h) => {
  if (h.id === "team-arkavati") {
    return {
      teamId: h.id,
      teamName: h.name,
      sportId: "cricket" as const,
      played: 1,
      won: 1,
      lost: 0,
      tied: 0,
      points: 2,
      netRunRate: 0.75,
      form: ["W" as const],
      isDemo: true,
    };
  }
  if (h.id === "team-tons") {
    return {
      teamId: h.id,
      teamName: h.name,
      sportId: "cricket" as const,
      played: 1,
      won: 0,
      lost: 1,
      tied: 0,
      points: 0,
      netRunRate: -0.75,
      form: ["L" as const],
      isDemo: true,
    };
  }
  return {
    teamId: h.id,
    teamName: h.name,
    sportId: "cricket" as const,
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    points: 0,
    netRunRate: 0,
    form: [],
    isDemo: true,
  };
});

// Exactly ONE top performer
export const SHOWCASE_TOP_PERFORMER = {
  playerId: "p-al-demo-1",
  name: "Arkavati Athlete 1",
  houseName: "Arkavati Lions",
  houseCode: "AL",
  sport: "Cricket",
  highlight: "45 runs (28b) & 2/24",
  isDemo: true,
};

