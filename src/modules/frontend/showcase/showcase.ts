import { Match, Player, Standing, Team, User } from "../types";
import { HPL_HOUSES } from "../config/houses";
import { ALL_SHOWCASE_PLAYERS } from "./players-data";
import { SHOWCASE_MATCHES, SHOWCASE_FIXTURES, getShowcaseStandings } from "./matches-data";
import { ALL_SHOWCASE_ADMINS, SHOWCASE_SUPER_ADMIN, SHOWCASE_SPORT_ADMINS } from "./admins-data";

export * from "./sports-data";
export * from "./players-data";
export * from "./matches-data";
export * from "./admins-data";

export const SHOWCASE_PLAYERS: Player[] = ALL_SHOWCASE_PLAYERS;

export const SHOWCASE_TEAMS: Team[] = HPL_HOUSES.map((h) => ({
  ...h,
  playerIds: ALL_SHOWCASE_PLAYERS.filter((p) => p.teamId === h.id).map((p) => p.id),
  isDemo: true,
}));

// Backwards-compatible single showcase match (Cricket)
export const SHOWCASE_MATCH: Match = SHOWCASE_MATCHES[0];

// All showcase matches across all 6 departments
export { SHOWCASE_MATCHES, SHOWCASE_FIXTURES, getShowcaseStandings };

// Backwards-compatible single standings export (Cricket)
export const SHOWCASE_STANDINGS: Standing[] = getShowcaseStandings("cricket");

// Admins across all departments
export const SHOWCASE_ADMINS: User[] = ALL_SHOWCASE_ADMINS;
export { SHOWCASE_SUPER_ADMIN, SHOWCASE_SPORT_ADMINS };

// Top Performer per Department
export const SHOWCASE_TOP_PERFORMER = {
  playerId: "p-al-demo-1",
  name: "Arkavati Athlete 1",
  houseName: "Arkavati Lions",
  houseCode: "AL",
  sport: "Cricket",
  highlight: "45 runs (28b) & 2/24",
  isDemo: true,
};

export const SHOWCASE_TOP_PERFORMERS = [
  SHOWCASE_TOP_PERFORMER,
  { playerId: "p-demo-fb-kl-1", name: "Kabini Striker 1", houseName: "Kabini Lynx", houseCode: "KL", sport: "Football", highlight: "1 Goal (23')", isDemo: true },
  { playerId: "p-demo-kb-ol-1", name: "Orsang Raider 1", houseName: "Orsang Leopards", houseCode: "OL", sport: "Kabaddi", highlight: "Super Raid (12 Pts)", isDemo: true },
  { playerId: "p-demo-bd-hj-1", name: "Harangi Shuttler 1", houseName: "Harangi Jaguars", houseCode: "HJ", sport: "Badminton", highlight: "Game 1 Winner (21-17)", isDemo: true },
  { playerId: "p-demo-vb-hj-1", name: "Harangi Spiker 1", houseName: "Harangi Jaguars", houseCode: "HJ", sport: "Volleyball", highlight: "2 Sets Won", isDemo: true },
  { playerId: "p-demo-bb-kc-1", name: "Ken Point Guard 1", houseName: "Ken Cheetahs", houseCode: "KC", sport: "Basketball", highlight: "24 Pts & 6 Ast", isDemo: true },
];
