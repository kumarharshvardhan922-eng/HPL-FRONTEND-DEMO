import { SportId, User } from "../types/domain";
import { Match } from "../types/scoring";
import { HPL_SPORTS } from "../config/sports";

/**
 * Returns whether a user has administrative permission to access or view a sport.
 * - Super admin: all configured sports
 * - Sport admin: only assigned sports
 * - Public: none (read-only portal)
 */
export function canAccessSport(user: User | null | undefined, sportId: SportId | string): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  if (user.role === "sport_admin") {
    const assigned = user.assignedSports ?? user.assignedSportIds ?? [];
    return assigned.includes(sportId as SportId);
  }
  return false;
}

/**
 * Returns whether a user has permission to score or update a match.
 * - Super admin: all matches
 * - Sport admin: only matches belonging to their assigned sport
 * - Public: none (read-only)
 */
export function canScoreMatch(user: User | null | undefined, match: Match | null | undefined): boolean {
  if (!user || !match) return false;
  return canAccessSport(user, match.sportId);
}

/**
 * Returns the list of SportIds visible/managed for this user in administrative context.
 * - Super admin: all sports from config/sports.ts
 * - Sport admin: only their assigned sports (intersected with valid sports)
 * - Public: empty list
 */
export function visibleSports(user: User | null | undefined): SportId[] {
  if (!user) return [];
  const allSportIds = HPL_SPORTS.map((s) => s.id);
  if (user.role === "super_admin") {
    return allSportIds;
  }
  if (user.role === "sport_admin") {
    const assigned = user.assignedSports ?? user.assignedSportIds ?? [];
    const validSet = new Set(allSportIds);
    return assigned.filter((id) => validSet.has(id));
  }
  return [];
}

/**
 * Returns whether a user can access the /admin backoffice area.
 * - Super admin & Sport admin: true
 * - Public user / unauthenticated: false
 */
export function canAccessAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.role === "super_admin" || user.role === "sport_admin";
}

/**
 * Returns whether a user can manage platform-wide settings, admins, or sports list.
 * - Super admin: true
 * - Sport admin & Public: false
 */
export function canManagePlatform(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.role === "super_admin";
}
