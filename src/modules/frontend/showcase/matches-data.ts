import { Match, Standing, SportId, Fixture } from "../types";
import { HPL_HOUSES } from "../config/houses";
import {
  SHOWCASE_CRICKET_STATE,
  SHOWCASE_FOOTBALL_STATE,
  SHOWCASE_KABADDI_STATE,
  SHOWCASE_BADMINTON_STATE,
  SHOWCASE_VOLLEYBALL_STATE,
  SHOWCASE_BASKETBALL_STATE,
} from "./sports-data";

export const SHOWCASE_MATCHES: Match[] = [
  // 1. Cricket (Completed)
  {
    id: "match-demo-showcase",
    sportId: "cricket",
    teamAId: "team-arkavati",
    teamBId: "team-tons",
    status: "completed",
    startTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    venue: "Main Sports Complex Oval",
    round: "Cricket Exhibition Match",
    refereeUmpire: "Official Cricket Umpire",
    tossWinnerTeamId: "team-arkavati",
    tossDecision: "bat",
    resultSummary: "Arkavati Lions won by 15 runs",
    scoreState: SHOWCASE_CRICKET_STATE,
    events: [
      { id: "ev-demo-cr-1", matchId: "match-demo-showcase", sportId: "cricket", timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(), displayTime: "6.2 ov", eventType: "fifty_partnership", teamId: "team-arkavati", detail: "50-run opening stand reached in 38 balls.", isDemo: true },
      { id: "ev-demo-cr-2", matchId: "match-demo-showcase", sportId: "cricket", timestamp: new Date(Date.now() - 1.8 * 3600 * 1000).toISOString(), displayTime: "14.4 ov", eventType: "six", teamId: "team-arkavati", detail: "Massive six over mid-wicket.", isDemo: true },
    ],
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  },
  // 2. Football (Live)
  {
    id: "match-demo-football",
    sportId: "football",
    teamAId: "team-kabini",
    teamBId: "team-ken",
    status: "live",
    startTime: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    venue: "Main Football Arena",
    round: "Football League Match 1",
    refereeUmpire: "Official Football Referee",
    scoreState: SHOWCASE_FOOTBALL_STATE,
    events: [
      { id: "ev-demo-fb-1", matchId: "match-demo-football", sportId: "football", timestamp: new Date(Date.now() - 52 * 60 * 1000).toISOString(), displayTime: "23'", eventType: "goal", teamId: "team-kabini", detail: "Goal by Kabini Striker 1 (Assist by Playmaker 1)", isDemo: true },
      { id: "ev-demo-fb-2", matchId: "match-demo-football", sportId: "football", timestamp: new Date(Date.now() - 21 * 60 * 1000).toISOString(), displayTime: "54'", eventType: "goal", teamId: "team-ken", detail: "Equalizer by Ken Winger 1", isDemo: true },
    ],
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  },
  // 3. Kabaddi (Live)
  {
    id: "match-demo-kabaddi",
    sportId: "kabaddi",
    teamAId: "team-orsang",
    teamBId: "team-shimsha",
    status: "live",
    startTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    venue: "Indoor Kabaddi Mat 1",
    round: "Kabaddi League Match 1",
    refereeUmpire: "Official Kabaddi Referee",
    scoreState: SHOWCASE_KABADDI_STATE,
    events: [
      { id: "ev-demo-kb-1", matchId: "match-demo-kabaddi", sportId: "kabaddi", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), displayTime: "12m", eventType: "super_raid", teamId: "team-orsang", detail: "Super Raid (3 points) by Orsang Raider 1", isDemo: true },
    ],
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  },
  // 4. Badminton (Live)
  {
    id: "match-demo-badminton",
    sportId: "badminton",
    teamAId: "team-harangi",
    teamBId: "team-arkavati",
    status: "live",
    startTime: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    venue: "Badminton Court 2",
    round: "Men's Singles Quarter-Final",
    refereeUmpire: "Badminton Chief Umpire",
    scoreState: SHOWCASE_BADMINTON_STATE,
    events: [],
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  },
  // 5. Volleyball (Live)
  {
    id: "match-demo-volleyball",
    sportId: "volleyball",
    teamAId: "team-harangi",
    teamBId: "team-kabini",
    status: "live",
    startTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    venue: "Outdoor Volleyball Court A",
    round: "Volleyball Group Stage",
    refereeUmpire: "Volleyball First Referee",
    scoreState: SHOWCASE_VOLLEYBALL_STATE,
    events: [],
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  },
  // 6. Basketball (Completed)
  {
    id: "match-demo-basketball",
    sportId: "basketball",
    teamAId: "team-ken",
    teamBId: "team-orsang",
    status: "completed",
    startTime: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    venue: "Main Basketball Arena",
    round: "Basketball Round Robin",
    refereeUmpire: "Basketball Lead Referee",
    resultSummary: "Ken Cheetahs won 68 - 64",
    scoreState: SHOWCASE_BASKETBALL_STATE,
    events: [],
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  },
];

export const SHOWCASE_FIXTURES: Fixture[] = SHOWCASE_MATCHES.map((m) => ({
  id: `fixture-demo-${m.sportId}`,
  matchId: m.id,
  sportId: m.sportId,
  teamAId: m.teamAId,
  teamBId: m.teamBId,
  round: m.round,
  scheduledStartTime: m.startTime,
  venue: m.venue,
  isDemo: true,
}));

export function getShowcaseStandings(sportId: SportId): Standing[] {
  return HPL_HOUSES.map((h) => {
    let played = 0, won = 0, lost = 0, points = 0, nrr = 0, gd = 0, sd = 0;
    const form: ("W" | "L" | "D")[] = [];

    if (sportId === "cricket") {
      if (h.id === "team-arkavati") { played = 1; won = 1; points = 2; nrr = 0.75; form.push("W"); }
      else if (h.id === "team-tons") { played = 1; lost = 1; points = 0; nrr = -0.75; form.push("L"); }
    } else if (sportId === "football") {
      if (h.id === "team-kabini") { played = 1; won = 1; points = 3; gd = 1; form.push("W"); }
      else if (h.id === "team-ken") { played = 1; lost = 1; points = 0; gd = -1; form.push("L"); }
    } else if (sportId === "kabaddi") {
      if (h.id === "team-orsang") { played = 1; won = 1; points = 5; sd = 3; form.push("W"); }
      else if (h.id === "team-shimsha") { played = 1; lost = 1; points = 1; sd = -3; form.push("L"); }
    } else if (sportId === "badminton") {
      if (h.id === "team-harangi") { played = 1; won = 1; points = 2; form.push("W"); }
      else if (h.id === "team-arkavati") { played = 1; lost = 1; points = 0; form.push("L"); }
    } else if (sportId === "volleyball") {
      if (h.id === "team-harangi") { played = 1; won = 1; points = 3; form.push("W"); }
      else if (h.id === "team-kabini") { played = 1; lost = 1; points = 1; form.push("L"); }
    } else if (sportId === "basketball") {
      if (h.id === "team-ken") { played = 1; won = 1; points = 2; sd = 4; form.push("W"); }
      else if (h.id === "team-orsang") { played = 1; lost = 1; points = 0; sd = -4; form.push("L"); }
    }

    return {
      teamId: h.id,
      teamName: h.name,
      sportId,
      played,
      won,
      lost,
      tied: 0,
      points,
      netRunRate: nrr,
      goalDifference: gd,
      scoreDifference: sd,
      form,
      isDemo: true,
    };
  });
}
