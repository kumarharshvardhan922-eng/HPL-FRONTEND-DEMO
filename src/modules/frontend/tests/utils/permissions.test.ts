import { describe, it, expect } from "vitest";
import { canAccessSport, canScoreMatch, visibleSports, canAccessAdmin, canManagePlatform } from "../../utils/permissions";
import { SportId, User } from "../../types/domain";
import { Match } from "../../types/scoring";
import { HPL_SPORTS } from "../../config/sports";

const ALL_SPORTS: SportId[] = ["cricket", "football", "kabaddi", "badminton", "volleyball", "basketball"];

describe("Permission Helpers Unit Tests", () => {
  const superAdmin: User = {
    id: "user-super",
    email: "super@hpl.ac.in",
    displayName: "Super Admin",
    role: "super_admin",
  };

  const publicUser: User = {
    id: "user-public",
    email: "viewer@gmail.com",
    displayName: "Public Viewer",
    role: "public",
  };

  const emptySportAdmin: User = {
    id: "user-empty-admin",
    email: "empty@hpl.ac.in",
    displayName: "Unassigned Admin",
    role: "sport_admin",
    assignedSports: [],
  };

  describe("canAccessSport", () => {
    it("allows Super Admin access to every configured sport and unknown sport", () => {
      for (const sport of ALL_SPORTS) {
        expect(canAccessSport(superAdmin, sport)).toBe(true);
      }
      expect(canAccessSport(superAdmin, "tennis" as SportId)).toBe(true);
    });

    it("restricts Sport Admin strictly to assigned sports", () => {
      for (const sport of ALL_SPORTS) {
        const admin: User = {
          id: `admin-${sport}`,
          email: `${sport}@hpl.ac.in`,
          displayName: `${sport} Admin`,
          role: "sport_admin",
          assignedSports: [sport],
        };

        expect(canAccessSport(admin, sport)).toBe(true);

        const otherSports = ALL_SPORTS.filter((s) => s !== sport);
        for (const other of otherSports) {
          expect(canAccessSport(admin, other)).toBe(false);
        }
      }
    });

    it("supports assignedSportIds as fallback for assignedSports", () => {
      const adminWithIds: User = {
        id: "admin-legacy",
        email: "legacy@hpl.ac.in",
        displayName: "Legacy Admin",
        role: "sport_admin",
        assignedSportIds: ["football"],
      };

      expect(canAccessSport(adminWithIds, "football")).toBe(true);
      expect(canAccessSport(adminWithIds, "cricket")).toBe(false);
    });

    it("denies access when Sport Admin has empty assignedSports", () => {
      for (const sport of ALL_SPORTS) {
        expect(canAccessSport(emptySportAdmin, sport)).toBe(false);
      }
    });

    it("denies access to Public User for all sports", () => {
      for (const sport of ALL_SPORTS) {
        expect(canAccessSport(publicUser, sport)).toBe(false);
      }
      expect(canAccessSport(publicUser, "curling" as SportId)).toBe(false);
    });

    it("returns false for null or undefined user", () => {
      expect(canAccessSport(null, "cricket")).toBe(false);
      expect(canAccessSport(undefined, "cricket")).toBe(false);
    });
  });

  describe("canScoreMatch", () => {
    const cricketMatch: Match = {
      id: "match-c-1",
      sportId: "cricket",
      teamAId: "AL",
      teamBId: "TT",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Main Oval",
      round: "Round 1",
      refereeUmpire: "Official",
      scoreState: {
        sportId: "cricket",
        runsA: 10,
        wicketsA: 0,
        oversA: 2,
        ballsA: 0,
        extrasA: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
        runsB: 0,
        wicketsB: 0,
        oversB: 0,
        ballsB: 0,
        extrasB: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
        currentInnings: 1,
        currentBattingTeamId: "AL",
        currentBowlingTeamId: "TT",
        batsmen: {},
        bowlers: {},
        recentBalls: [],
        totalOversAllowed: 20,
      },
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    const footballMatch: Match = {
      ...cricketMatch,
      id: "match-f-1",
      sportId: "football",
      scoreState: {
        sportId: "football",
        goalsA: 1,
        goalsB: 0,
        currentHalf: 1,
        matchTimeMinutes: 30,
        extraTimeMinutes: 0,
        possessionA: 55,
        possessionB: 45,
        shotsA: 5,
        shotsB: 3,
        shotsOnTargetA: 3,
        shotsOnTargetB: 1,
        cornersA: 2,
        cornersB: 1,
        foulsA: 4,
        foulsB: 6,
        yellowCardsA: 1,
        yellowCardsB: 0,
        redCardsA: 0,
        redCardsB: 0,
        goals: [],
        formationA: "4-4-2",
        formationB: "4-3-3",
        playerRatings: {},
      },
    };

    const footballAdmin: User = {
      id: "admin-fb",
      email: "fb@hpl.ac.in",
      displayName: "Football Admin",
      role: "sport_admin",
      assignedSports: ["football"],
    };

    it("allows Super Admin to score any match", () => {
      expect(canScoreMatch(superAdmin, cricketMatch)).toBe(true);
      expect(canScoreMatch(superAdmin, footballMatch)).toBe(true);
    });

    it("allows Sport Admin to score matches of assigned sport only", () => {
      expect(canScoreMatch(footballAdmin, footballMatch)).toBe(true);
      expect(canScoreMatch(footballAdmin, cricketMatch)).toBe(false);
    });

    it("disallows Public User from scoring matches", () => {
      expect(canScoreMatch(publicUser, cricketMatch)).toBe(false);
      expect(canScoreMatch(publicUser, footballMatch)).toBe(false);
    });

    it("returns false for null match or null user", () => {
      expect(canScoreMatch(superAdmin, null)).toBe(false);
      expect(canScoreMatch(null, footballMatch)).toBe(false);
    });
  });

  describe("visibleSports", () => {
    it("returns all configured sports for Super Admin", () => {
      const visible = visibleSports(superAdmin);
      expect(visible).toEqual(HPL_SPORTS.map((s) => s.id));
      expect(visible).toHaveLength(6);
    });

    it("returns only assigned valid sports for Sport Admin", () => {
      const admin: User = {
        id: "admin-multi",
        email: "multi@hpl.ac.in",
        displayName: "Multi Admin",
        role: "sport_admin",
        assignedSports: ["kabaddi", "badminton"],
      };

      expect(visibleSports(admin)).toEqual(["kabaddi", "badminton"]);
    });

    it("filters out unknown sports for Sport Admin", () => {
      const admin: User = {
        id: "admin-unknown",
        email: "u@hpl.ac.in",
        displayName: "Unknown Sport Admin",
        role: "sport_admin",
        assignedSports: ["football", "curling" as SportId],
      };

      expect(visibleSports(admin)).toEqual(["football"]);
    });

    it("returns empty array for Public User or empty admin", () => {
      expect(visibleSports(publicUser)).toEqual([]);
      expect(visibleSports(emptySportAdmin)).toEqual([]);
      expect(visibleSports(null)).toEqual([]);
    });
  });

  describe("canAccessAdmin & canManagePlatform", () => {
    it("canAccessAdmin is true for Super Admin and Sport Admin, false for Public", () => {
      expect(canAccessAdmin(superAdmin)).toBe(true);
      expect(canAccessAdmin(emptySportAdmin)).toBe(true);
      expect(canAccessAdmin(publicUser)).toBe(false);
      expect(canAccessAdmin(null)).toBe(false);
    });

    it("canManagePlatform is true only for Super Admin", () => {
      expect(canManagePlatform(superAdmin)).toBe(true);
      expect(canManagePlatform(emptySportAdmin)).toBe(false);
      expect(canManagePlatform(publicUser)).toBe(false);
    });
  });
});
