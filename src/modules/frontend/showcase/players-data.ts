import { Player } from "../types";

// Cricket Squads
export const SHOWCASE_CRICKET_PLAYERS_A: Player[] = Array.from({ length: 11 }, (_, i) => ({
  id: `p-al-demo-${i + 1}`,
  teamId: "team-arkavati",
  name: `Arkavati Athlete ${i + 1}`,
  jerseyNumber: i + 1,
  sportId: "cricket",
  role: i === 0 ? "Captain & All-Rounder" : i < 5 ? "Batsman" : i === 5 ? "Wicketkeeper" : "Bowler",
  photoPlaceholderUrl: "",
  stats: { matches: 1, runs: i === 0 ? 45 : i === 1 ? 32 : 12, wickets: i === 0 ? 2 : i > 6 ? 1 : 0, mvpAwards: i === 0 ? 1 : 0 },
  isDemo: true,
}));

export const SHOWCASE_CRICKET_PLAYERS_B: Player[] = Array.from({ length: 11 }, (_, i) => ({
  id: `p-tt-demo-${i + 1}`,
  teamId: "team-tons",
  name: `Tons Athlete ${i + 1}`,
  jerseyNumber: i + 1,
  sportId: "cricket",
  role: i === 0 ? "Captain & Bowler" : i < 5 ? "Batsman" : i === 5 ? "Wicketkeeper" : "Bowler",
  photoPlaceholderUrl: "",
  stats: { matches: 1, runs: i === 1 ? 40 : 10, wickets: i === 0 ? 2 : 0, mvpAwards: 0 },
  isDemo: true,
}));

// Football Squads (Kabini Lynx vs Ken Cheetahs)
export const SHOWCASE_FOOTBALL_PLAYERS: Player[] = [
  { id: "p-demo-fb-kl-1", teamId: "team-kabini", name: "Kabini Striker 1", jerseyNumber: 9, sportId: "football", role: "Forward", photoPlaceholderUrl: "", stats: { matches: 1, goals: 1 }, isDemo: true },
  { id: "p-demo-fb-kl-2", teamId: "team-kabini", name: "Kabini Playmaker 1", jerseyNumber: 10, sportId: "football", role: "Midfielder", photoPlaceholderUrl: "", stats: { matches: 1, assists: 1 }, isDemo: true },
  { id: "p-demo-fb-kl-3", teamId: "team-kabini", name: "Kabini Defender 1", jerseyNumber: 4, sportId: "football", role: "Defender", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
  { id: "p-demo-fb-kc-1", teamId: "team-ken", name: "Ken Winger 1", jerseyNumber: 7, sportId: "football", role: "Forward", photoPlaceholderUrl: "", stats: { matches: 1, goals: 1 }, isDemo: true },
  { id: "p-demo-fb-kc-2", teamId: "team-ken", name: "Ken Goalkeeper 1", jerseyNumber: 1, sportId: "football", role: "Goalkeeper", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
];

// Kabaddi Squads (Orsang Leopards vs Shimsha Panthers)
export const SHOWCASE_KABADDI_PLAYERS: Player[] = [
  { id: "p-demo-kb-ol-1", teamId: "team-orsang", name: "Orsang Raider 1", jerseyNumber: 1, sportId: "kabaddi", role: "Raider", photoPlaceholderUrl: "", stats: { matches: 1, raidPoints: 12 }, isDemo: true },
  { id: "p-demo-kb-ol-2", teamId: "team-orsang", name: "Orsang Corner 1", jerseyNumber: 2, sportId: "kabaddi", role: "Right Corner", photoPlaceholderUrl: "", stats: { matches: 1, tacklePoints: 4 }, isDemo: true },
  { id: "p-demo-kb-sp-1", teamId: "team-shimsha", name: "Shimsha Raider 1", jerseyNumber: 1, sportId: "kabaddi", role: "Raider", photoPlaceholderUrl: "", stats: { matches: 1, raidPoints: 10 }, isDemo: true },
  { id: "p-demo-kb-sp-2", teamId: "team-shimsha", name: "Shimsha Cover 1", jerseyNumber: 2, sportId: "kabaddi", role: "Left Cover", photoPlaceholderUrl: "", stats: { matches: 1, tacklePoints: 3 }, isDemo: true },
];

// Badminton Squads (Harangi Jaguars vs Arkavati Lions)
export const SHOWCASE_BADMINTON_PLAYERS: Player[] = [
  { id: "p-demo-bd-hj-1", teamId: "team-harangi", name: "Harangi Shuttler 1", jerseyNumber: 1, sportId: "badminton", role: "Singles Specialist", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
  { id: "p-demo-bd-al-1", teamId: "team-arkavati", name: "Arkavati Shuttler 1", jerseyNumber: 1, sportId: "badminton", role: "Singles Specialist", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
];

// Volleyball Squads (Harangi Jaguars vs Kabini Lynx)
export const SHOWCASE_VOLLEYBALL_PLAYERS: Player[] = [
  { id: "p-demo-vb-hj-1", teamId: "team-harangi", name: "Harangi Spiker 1", jerseyNumber: 7, sportId: "volleyball", role: "Outside Hitter", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
  { id: "p-demo-vb-hj-2", teamId: "team-harangi", name: "Harangi Setter 1", jerseyNumber: 3, sportId: "volleyball", role: "Setter", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
  { id: "p-demo-vb-kl-1", teamId: "team-kabini", name: "Kabini Blocker 1", jerseyNumber: 5, sportId: "volleyball", role: "Middle Blocker", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
  { id: "p-demo-vb-kl-2", teamId: "team-kabini", name: "Kabini Libero 1", jerseyNumber: 12, sportId: "volleyball", role: "Libero", photoPlaceholderUrl: "", stats: { matches: 1 }, isDemo: true },
];

// Basketball Squads (Ken Cheetahs vs Orsang Leopards)
export const SHOWCASE_BASKETBALL_PLAYERS: Player[] = [
  { id: "p-demo-bb-kc-1", teamId: "team-ken", name: "Ken Point Guard 1", jerseyNumber: 3, sportId: "basketball", role: "Point Guard", photoPlaceholderUrl: "", stats: { matches: 1, points: 24, assists: 6 }, isDemo: true },
  { id: "p-demo-bb-kc-2", teamId: "team-ken", name: "Ken Center 1", jerseyNumber: 15, sportId: "basketball", role: "Center", photoPlaceholderUrl: "", stats: { matches: 1, rebounds: 11 }, isDemo: true },
  { id: "p-demo-bb-ol-1", teamId: "team-orsang", name: "Orsang Forward 1", jerseyNumber: 23, sportId: "basketball", role: "Power Forward", photoPlaceholderUrl: "", stats: { matches: 1, points: 21 }, isDemo: true },
  { id: "p-demo-bb-ol-2", teamId: "team-orsang", name: "Orsang Guard 1", jerseyNumber: 11, sportId: "basketball", role: "Shooting Guard", photoPlaceholderUrl: "", stats: { matches: 1, points: 18 }, isDemo: true },
];

export const ALL_SHOWCASE_PLAYERS: Player[] = [
  ...SHOWCASE_CRICKET_PLAYERS_A,
  ...SHOWCASE_CRICKET_PLAYERS_B,
  ...SHOWCASE_FOOTBALL_PLAYERS,
  ...SHOWCASE_KABADDI_PLAYERS,
  ...SHOWCASE_BADMINTON_PLAYERS,
  ...SHOWCASE_VOLLEYBALL_PLAYERS,
  ...SHOWCASE_BASKETBALL_PLAYERS,
];
