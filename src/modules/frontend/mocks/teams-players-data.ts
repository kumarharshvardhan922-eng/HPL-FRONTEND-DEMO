import { Player, Team } from "../types";

export const MOCK_TEAMS: Team[] = [
  {
    id: "team-arkavati",
    name: "Arkavati Lions",
    shortName: "AL",
    hostelBlock: "Block A - Arkavati",
    primaryColor: "#f59e0b",
    secondaryColor: "#fef3c7",
    logoUrl: "/teams/arkavati.png",
    captainId: "p-arkavati-1",
    playerIds: Array.from({ length: 16 }, (_, i) => `p-arkavati-${i + 1}`),
  },
  {
    id: "team-harangi",
    name: "Harangi Jaguars",
    shortName: "HJ",
    hostelBlock: "Block H - Harangi",
    primaryColor: "#10b981",
    secondaryColor: "#d1fae5",
    logoUrl: "/teams/harangi.png",
    captainId: "p-harangi-1",
    playerIds: Array.from({ length: 16 }, (_, i) => `p-harangi-${i + 1}`),
  },
  {
    id: "team-kabini",
    name: "Kabini Lynx",
    shortName: "KL",
    hostelBlock: "Block K - Kabini",
    primaryColor: "#38b6ff",
    secondaryColor: "#e0f2fe",
    logoUrl: "/teams/kabini.png",
    captainId: "p-kabini-1",
    playerIds: Array.from({ length: 15 }, (_, i) => `p-kabini-${i + 1}`),
  },
  {
    id: "team-ken",
    name: "Ken Cheetahs",
    shortName: "KC",
    hostelBlock: "Block C - Ken",
    primaryColor: "#f97316",
    secondaryColor: "#ffedd5",
    logoUrl: "/teams/ken.png",
    captainId: "p-ken-1",
    playerIds: Array.from({ length: 15 }, (_, i) => `p-ken-${i + 1}`),
  },
  {
    id: "team-orsang",
    name: "Orsang Leopards",
    shortName: "OL",
    hostelBlock: "Block O - Orsang",
    primaryColor: "#a855f7",
    secondaryColor: "#f3e8ff",
    logoUrl: "/teams/orsang.png",
    captainId: "p-orsang-1",
    playerIds: Array.from({ length: 15 }, (_, i) => `p-orsang-${i + 1}`),
  },
  {
    id: "team-shimsha",
    name: "Shimsha Panthers",
    shortName: "SP",
    hostelBlock: "Block S - Shimsha",
    primaryColor: "#ec4899",
    secondaryColor: "#fce7f3",
    logoUrl: "/teams/shimsha.png",
    captainId: "p-shimsha-1",
    playerIds: Array.from({ length: 15 }, (_, i) => `p-shimsha-${i + 1}`),
  },
  {
    id: "team-tons",
    name: "Tons Tigers",
    shortName: "TT",
    hostelBlock: "Block T - Tons",
    primaryColor: "#06b6d4",
    secondaryColor: "#cffafe",
    logoUrl: "/teams/tons.png",
    captainId: "p-tons-1",
    playerIds: Array.from({ length: 14 }, (_, i) => `p-tons-${i + 1}`),
  },
];

const FIRST_NAMES = [
  "Aarav", "Kabir", "Rohan", "Vivaan", "Aditya", "Dev", "Ishan", "Arjun",
  "Karan", "Neil", "Rahul", "Samar", "Tanmay", "Yash", "Dhruv", "Varun"
];
const LAST_NAMES = [
  "Sharma", "Verma", "Patel", "Singh", "Reddy", "Iyer", "Nair", "Mehta",
  "Chopra", "Kulkarni", "Das", "Rao", "Joshi", "Gupta", "Malhotra", "Saxena"
];

const ROLES_BY_SPORT: Record<string, string[]> = {
  cricket: ["Top-order Batsman", "Middle-order Batsman", "Wicketkeeper-Batsman", "All-Rounder", "Fast Bowler", "Spin Bowler"],
  football: ["Goalkeeper", "Center Back", "Full Back", "Defensive Midfielder", "Attacking Midfielder", "Winger", "Striker"],
  kabaddi: ["Right Raider", "Left Raider", "Corner Defender", "Cover Defender", "All-Rounder"],
  badminton: ["Singles Specialist", "Doubles Front", "Doubles Back"],
  volleyball: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite", "Libero"],
  basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
};

export const MOCK_PLAYERS: Player[] = MOCK_TEAMS.flatMap((team) => {
  const teamPrefix = team.id.replace("team-", "");
  return team.playerIds.map((pid, idx) => {
    const fn = FIRST_NAMES[(idx * 3 + teamPrefix.charCodeAt(0)) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(idx * 7 + teamPrefix.charCodeAt(1)) % LAST_NAMES.length];
    const sportsList: ("cricket" | "football" | "kabaddi" | "badminton" | "volleyball" | "basketball")[] = [
      "cricket", "football", "kabaddi", "badminton", "volleyball", "basketball"
    ];
    const sportId = sportsList[idx % sportsList.length];
    const roles = ROLES_BY_SPORT[sportId];
    const role = roles[idx % roles.length];

    return {
      id: pid,
      teamId: team.id,
      name: `${fn} ${ln}`,
      jerseyNumber: idx === 0 ? 7 : (idx * 4 + 3) % 99 + 1,
      sportId,
      role,
      photoPlaceholderUrl: "",
      stats: {
        matches: 4 + (idx % 8),
        mvpAwards: idx === 0 ? 3 : (idx % 2 === 0 ? 1 : 0),
        performanceRating: 7.2 + ((idx * 3) % 25) / 10,
      },
    };
  });
});
