"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Role, SportId, User } from "../types";
import { useServices } from "./services-provider";

export interface AuthViewContextValue {
  currentUser: User | null;
  role: Role;
  assignedSportIds: SportId[];
  isLoading: boolean;
  switchRole: (role: Role, assignedSportIds?: SportId[]) => Promise<void>;
  isPermittedForSport: (sportId: SportId) => boolean;
  canAccessAdminRoute: (route: string) => boolean;
}

const AuthViewContext = createContext<AuthViewContextValue | null>(null);

export const AuthViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authView } = useServices();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const u = await authView.getCurrentUser();
      setCurrentUser(u);
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
        const updated = await authView.setRole(role, assignedSportIds);
        setCurrentUser(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [authView]
  );

  const role: Role = currentUser?.role || "public";
  const assignedSportIds: SportId[] = useMemo(() => currentUser?.assignedSportIds || [], [currentUser?.assignedSportIds]);

  const isPermittedForSport = useCallback(
    (sportId: SportId): boolean => {
      if (role === "super_admin") return true;
      if (role === "sport_admin") {
        return assignedSportIds.includes(sportId);
      }
      return false;
    },
    [role, assignedSportIds]
  );

  const canAccessAdminRoute = useCallback(
    (route: string): boolean => {
      if (role === "super_admin") return true;
      if (role === "sport_admin") {
        // Sport admins can access fixtures, scoring, and their assigned sports overview
        if (route.startsWith("/admin/admins") || route.startsWith("/admin/settings")) {
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
    throw new Error("useAuthView must be used within an AuthViewProvider");
  }
  return ctx;
}
