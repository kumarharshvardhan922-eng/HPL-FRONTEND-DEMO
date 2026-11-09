import { User } from "../types";

export const SHOWCASE_SUPER_ADMIN: User = {
  id: "user-demo-admin",
  email: "demo-admin@hpl.ac.in",
  displayName: "Tournament Demo Admin",
  role: "super_admin",
  isDemo: true,
};

export const SHOWCASE_SPORT_ADMINS: User[] = [
  {
    id: "admin-demo-cricket",
    email: "cricket-admin@hpl.ac.in",
    displayName: "Cricket Incharge",
    role: "sport_admin",
    assignedSportIds: ["cricket"],
    assignedSports: ["cricket"],
    isDemo: true,
  },
  {
    id: "admin-demo-football",
    email: "football-admin@hpl.ac.in",
    displayName: "Football Incharge",
    role: "sport_admin",
    assignedSportIds: ["football"],
    assignedSports: ["football"],
    isDemo: true,
  },
  {
    id: "admin-demo-kabaddi",
    email: "kabaddi-admin@hpl.ac.in",
    displayName: "Kabaddi Incharge",
    role: "sport_admin",
    assignedSportIds: ["kabaddi"],
    assignedSports: ["kabaddi"],
    isDemo: true,
  },
  {
    id: "admin-demo-badminton",
    email: "badminton-admin@hpl.ac.in",
    displayName: "Badminton Incharge",
    role: "sport_admin",
    assignedSportIds: ["badminton"],
    assignedSports: ["badminton"],
    isDemo: true,
  },
  {
    id: "admin-demo-volleyball",
    email: "volleyball-admin@hpl.ac.in",
    displayName: "Volleyball Incharge",
    role: "sport_admin",
    assignedSportIds: ["volleyball"],
    assignedSports: ["volleyball"],
    isDemo: true,
  },
  {
    id: "admin-demo-basketball",
    email: "basketball-admin@hpl.ac.in",
    displayName: "Basketball Incharge",
    role: "sport_admin",
    assignedSportIds: ["basketball"],
    assignedSports: ["basketball"],
    isDemo: true,
  },
];

export const ALL_SHOWCASE_ADMINS: User[] = [SHOWCASE_SUPER_ADMIN, ...SHOWCASE_SPORT_ADMINS];
