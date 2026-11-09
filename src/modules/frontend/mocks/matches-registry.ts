import { Match, ScoreEvent, SportId } from "../types";
import {
  SAMPLE_CRICKET_LIVE,
  SAMPLE_FOOTBALL_LIVE,
  SAMPLE_KABADDI_LIVE,
  SAMPLE_BADMINTON_LIVE,
  SAMPLE_VOLLEYBALL_LIVE,
  SAMPLE_BASKETBALL_LIVE,
} from "./matches-data";

const SPORTS: SportId[] = ["cricket", "football", "kabaddi", "badminton", "volleyball", "basketball"];
const TEAMS = [
  "team-arkavati",
  "team-harangi",
  "team-kabini",
  "team-ken",
  "team-orsang",
  "team-shimsha",
  "team-tons",
];
const VENUES = [
  "Main Sports Complex Oval",
  "Central Football Turf",
  "Indoor Sports Arena",
  "Court A - Badminton",
  "Volleyball Court 1",
  "Basketball Hardcourt",
];

function getSampleScoreState(sportId: SportId) {
  switch (sportId) {
    case "cricket": return JSON.parse(JSON.stringify(SAMPLE_CRICKET_LIVE));
    case "football": return JSON.parse(JSON.stringify(SAMPLE_FOOTBALL_LIVE));
    case "kabaddi": return JSON.parse(JSON.stringify(SAMPLE_KABADDI_LIVE));
    case "badminton": return JSON.parse(JSON.stringify(SAMPLE_BADMINTON_LIVE));
    case "volleyball": return JSON.parse(JSON.stringify(SAMPLE_VOLLEYBALL_LIVE));
    case "basketball": return JSON.parse(JSON.stringify(SAMPLE_BASKETBALL_LIVE));
  }
}

export function generateAllMatches(): Match[] {
  const matches: Match[] = [];

  SPORTS.forEach((sportId) => {
    // 1. LIVE MATCH #1 (Feature Live Match)
    matches.push({
      id: `match-${sportId}-live-1`,
      sportId,
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      status: "live",
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      venue: VENUES[SPORTS.indexOf(sportId)],
      round: "Group Stage - Round 1",
      refereeUmpire: "Prof. R. Narayanan",
      tossWinnerTeamId: "team-harangi",
      tossDecision: sportId === "cricket" ? "bat" : "serve",
      scoreState: getSampleScoreState(sportId),
      events: [
        {
          id: `ev-${sportId}-1`,
          matchId: `match-${sportId}-live-1`,
          sportId,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          displayTime: "12'",
          eventType: sportId === "cricket" ? "boundary" : sportId === "football" ? "goal" : "point",
          teamId: "team-arkavati",
          detail: "Opening points secured with aggressive offensive play.",
          isUndoable: false,
        },
        {
          id: `ev-${sportId}-2`,
          matchId: `match-${sportId}-live-1`,
          sportId,
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          displayTime: "34'",
          eventType: sportId === "cricket" ? "six" : sportId === "football" ? "yellow_card" : "super_raid",
          teamId: "team-harangi",
          detail: "Crucial counter-attack play swung momentum.",
          isUndoable: true,
        },
      ],
      lastUpdated: new Date().toISOString(),
    });

    // 2. LIVE MATCH #2 (Edge case: Match with NO events yet)
    matches.push({
      id: `match-${sportId}-live-no-events`,
      sportId,
      teamAId: "team-kabini",
      teamBId: "team-ken",
      status: "live",
      startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      venue: VENUES[SPORTS.indexOf(sportId)],
      round: "Group Stage - Round 2",
      refereeUmpire: "Dr. K. Swaminathan",
      tossWinnerTeamId: "team-kabini",
      tossDecision: "bat",
      scoreState: getSampleScoreState(sportId),
      events: [], // EDGE CASE: Empty events list
      lastUpdated: new Date().toISOString(),
    });

    // 3. COMPLETED MATCH #1 (Normal Winner)
    matches.push({
      id: `match-${sportId}-comp-1`,
      sportId,
      teamAId: "team-orsang",
      teamBId: "team-shimsha",
      status: "completed",
      startTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      endTime: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
      venue: VENUES[SPORTS.indexOf(sportId)],
      round: "Group Stage - Round 1",
      refereeUmpire: "Coach V. Rathore",
      resultSummary: "Orsang Leopards won by a commanding margin",
      scoreState: getSampleScoreState(sportId),
      events: [
        {
          id: `ev-${sportId}-c1`,
          matchId: `match-${sportId}-comp-1`,
          sportId,
          timestamp: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
          displayTime: "FT",
          eventType: "whistle",
          teamId: "team-orsang",
          detail: "Final whistle blown. Decisive victory.",
        },
      ],
      lastUpdated: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    });

    // 4. COMPLETED MATCH #2 (Edge case: TIED MATCH)
    matches.push({
      id: `match-${sportId}-comp-tied`,
      sportId,
      teamAId: "team-shimsha",
      teamBId: "team-tons",
      status: "completed",
      startTime: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      endTime: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
      venue: VENUES[SPORTS.indexOf(sportId)],
      round: "Group Stage - Round 1",
      refereeUmpire: "Prof. S. Joshi",
      resultSummary: "Match tied in dramatic fashion! Shared points.", // EDGE CASE: Tied
      scoreState: getSampleScoreState(sportId),
      events: [],
      lastUpdated: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
    });

    // 5. COMPLETED MATCH #3 (Edge case: WALKOVER)
    matches.push({
      id: `match-${sportId}-comp-walkover`,
      sportId,
      teamAId: "team-harangi",
      teamBId: "team-ken",
      status: "completed",
      startTime: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      endTime: new Date(Date.now() - 71 * 3600 * 1000).toISOString(),
      venue: VENUES[SPORTS.indexOf(sportId)],
      round: "Group Stage - Round 1",
      refereeUmpire: "Prof. M. Sen",
      resultSummary: "Walkover awarded to Harangi Jaguars due to forfeiting", // EDGE CASE: Walkover
      scoreState: getSampleScoreState(sportId),
      events: [],
      lastUpdated: new Date(Date.now() - 71 * 3600 * 1000).toISOString(),
    });

    // 6. UPCOMING MATCH WITH BYE (Edge case: Odd team Bye in 7-team league)
    matches.push({
      id: `match-${sportId}-upc-bye`,
      sportId,
      teamAId: "team-tons",
      teamBId: "bye",
      status: "upcoming",
      startTime: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      venue: "Rest Day / Byes",
      round: "Round 3 - Bye Round",
      refereeUmpire: "N/A",
      resultSummary: "Tons Tigers have a scheduled Bye this round",
      scoreState: getSampleScoreState(sportId),
      events: [],
      lastUpdated: new Date().toISOString(),
    });

    // 7-12. UPCOMING & ADDITIONAL COMPLETED MATCHES to reach 10+ per sport
    for (let i = 1; i <= 6; i++) {
      const isUpcoming = i <= 4;
      const hoursOffset = isUpcoming ? (i + 1) * 24 : - (i + 4) * 24;
      const teamAIndex = (i - 1) % TEAMS.length;
      const teamBIndex = (i + 2) % TEAMS.length;
      matches.push({
        id: `match-${sportId}-${isUpcoming ? "upc" : "comp"}-${i}`,
        sportId,
        teamAId: TEAMS[teamAIndex],
        teamBId: TEAMS[teamBIndex],
        status: isUpcoming ? "upcoming" : "completed",
        startTime: new Date(Date.now() + hoursOffset * 3600 * 1000).toISOString(),
        venue: VENUES[(i + SPORTS.indexOf(sportId)) % VENUES.length],
        round: isUpcoming ? (i === 4 ? "Quarter-Final" : "Group Stage") : "Preliminary",
        refereeUmpire: `Official Panel Ref #${i}`,
        resultSummary: isUpcoming ? undefined : `${TEAMS[teamAIndex].replace("team-", "")} won by tactical advantage`,
        scoreState: getSampleScoreState(sportId),
        events: [],
        lastUpdated: new Date().toISOString(),
      });
    }
  });

  return matches;
}

export const MOCK_MATCHES: Match[] = generateAllMatches();
