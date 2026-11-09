"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Role, SportId, User } from "../types";
import { useServices } from "./services-provider";
import { canAccessSport } from "../utils/permissions";

const DEV_ROLE_STORAGE_KEY = "hpl_dev_role";

export interface AuthViewContextValue {
  currentUser: User | null;
  role: Role;
  assignedSportIds: SportId[];
  assignedSports: SportId[];
  isLoading: boolean;
  switchRole: (role: Role, assignedSportIds?: SportId[]) => Promise<void>;
  isPermittedForSport: (sportId: SportId | string) => boolean;
  canAccessAdminRoute: (route: string) => boolean;
}

const AuthViewContext = createContext<AuthViewContextValue | null>(null);

export const AuthViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authView } = useServices();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      // Check sessionStorage for persisted dev role
      let savedRole: { role: Role; assignedSports?: SportId[] } | null = null;
      try {
        if (typeof window !== "undefined" && window.sessionStorage) {
          const raw = window.sessionStorage.getItem(DEV_ROLE_STORAGE_KEY);
          if (raw) savedRole = JSON.parse(raw);
        }
      } catch {
        // Ignore sessionStorage read errors
      }

      if (savedRole?.role) {
        const u = await authView.setRole(savedRole.role, savedRole.assignedSports);
        setCurrentUser(u);
      } else {
        const u = await authView.getCurrentUser();
        setCurrentUser(u);
      }
    } finally {
      setIsLoading(false);
    }
  }, [authView]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const switchRole = useCallback(
    async (role: Role, assignedSportIds?: SportId[]) => {
      setIsLoading(true);
      try {
        // Persist to sessionStorage
        try {
          if (typeof window !== "undefined" && window.sessionStorage) {
            window.sessionStorage.setItem(
              DEV_ROLE_STORAGE_KEY,
              JSON.stringify({ role, assignedSports: assignedSportIds })
            );
          }
        } catch {
          // Ignore sessionStorage write errors
        }

        const updated = await authView.setRole(role, assignedSportIds);
        setCurrentUser(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [authView]
  );

  const role: Role = currentUser?.role || "public";
  const assignedSportIds: SportId[] = useMemo(
    () => currentUser?.assignedSports || currentUser?.assignedSportIds || [],
    [currentUser?.assignedSports, currentUser?.assignedSportIds]
  );

  const isPermittedForSport = useCallback(
    (sportId: SportId | string): boolean => {
      return canAccessSport(currentUser, sportId as SportId);
    },
    [currentUser]
  );

  const canAccessAdminRoute = useCallback(
    (route: string): boolean => {
      if (role === "super_admin") return true;
      if (role === "sport_admin") {
        if (
          route.startsWith("/admin/admins") ||
          route.startsWith("/admin/settings") ||
          route.startsWith("/admin/sports")
        ) {
          return false;
        }
        return true;
      }
      return false; // public has no admin access
    },
    [role]
  );

  return (
    <AuthViewContext.Provider
      value={{
        currentUser,
        role,
        assignedSportIds,
        assignedSports: assignedSportIds,
        isLoading,
        switchRole,
        isPermittedForSport,
        canAccessAdminRoute,
      }}
    >
      {children}
    </AuthViewContext.Provider>
  );
};

export function useAuthView(): AuthViewContextValue {
  const ctx = useContext(AuthViewContext);
  if (!ctx) {
    return {
      currentUser: null,
      role: "super_admin",
      assignedSportIds: [],
      assignedSports: [],
      isLoading: false,
      switchRole: async () => {},
      isPermittedForSport: () => true,
      canAccessAdminRoute: () => true,
    };
  }
  return ctx;
}
