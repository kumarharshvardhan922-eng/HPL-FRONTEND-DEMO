import { User } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: "user-super-admin",
    email: "sports.convener@hpl.ac.in",
    displayName: "Prof. Arvind Raman (Super Admin)",
    role: "super_admin",
  },
  {
    id: "user-cricket-admin",
    email: "cricket.admin@hpl.ac.in",
    displayName: "Devendra Verma (Cricket Admin)",
    role: "sport_admin",
    assignedSportIds: ["cricket"],
  },
  {
    id: "user-football-admin",
    email: "football.admin@hpl.ac.in",
    displayName: "Siddharth Das (Football Admin)",
    role: "sport_admin",
    assignedSportIds: ["football"],
  },
  {
    id: "user-multi-admin",
    email: "indoor.admin@hpl.ac.in",
    displayName: "Priya Nair (Indoor Sports Admin)",
    role: "sport_admin",
    assignedSportIds: ["badminton", "volleyball", "basketball"],
  },
  {
    id: "user-public",
    email: "student@hpl.ac.in",
    displayName: "Hostel Resident (Viewer)",
    role: "public",
  },
];

