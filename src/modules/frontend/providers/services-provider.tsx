"use client";

import React, { createContext, useContext, useMemo } from "react";
import {
  AuthViewService,
  MatchesService,
  PlayersService,
  ScoringService,
  SportsService,
  StandingsService,
  TeamsService,
} from "../types";
import {
  EmptyAuthViewService,
  EmptyMatchesService,
  EmptyPlayersService,
  EmptyScoringService,
  EmptySportsService,
  EmptyStandingsService,
  EmptyTeamsService,
} from "../services/empty";
import {
  DemoAuthViewService,
  DemoMatchesService,
  DemoPlayersService,
  DemoScoringService,
  DemoSportsService,
  DemoStandingsService,
  DemoTeamsService,
} from "../services/demo";

export interface ServicesContextValue {
  sports: SportsService;
  teams: TeamsService;
  players: PlayersService;
  matches: MatchesService;
  scoring: ScoringService;
  standings: StandingsService;
  authView: AuthViewService;
  isDemoMode: boolean;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

export interface ServicesProviderProps {
  children: React.ReactNode;
  customServices?: Partial<Omit<ServicesContextValue, "isDemoMode">>;
  isDemo?: boolean;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({
  children,
  customServices,
  isDemo,
}) => {
  // Demo switch: NEXT_PUBLIC_FRONTEND_DEMO=1 loads the single showcase exhibition match.
  // Default: returns empty services satisfying all domain interfaces with zero data.
  const isDemoMode = isDemo ?? (process.env.NEXT_PUBLIC_FRONTEND_DEMO === "1");

  const services = useMemo<ServicesContextValue>(() => {
    if (isDemoMode) {
      return {
        sports: customServices?.sports ?? new DemoSportsService(),
        teams: customServices?.teams ?? new DemoTeamsService(),
        players: customServices?.players ?? new DemoPlayersService(),
        matches: customServices?.matches ?? new DemoMatchesService(),
        scoring: customServices?.scoring ?? new DemoScoringService(),
        standings: customServices?.standings ?? new DemoStandingsService(),
        authView: customServices?.authView ?? new DemoAuthViewService(),
        isDemoMode: true,
      };
    }

    return {
      sports: customServices?.sports ?? new EmptySportsService(),
      teams: customServices?.teams ?? new EmptyTeamsService(),
      players: customServices?.players ?? new EmptyPlayersService(),
      matches: customServices?.matches ?? new EmptyMatchesService(),
      scoring: customServices?.scoring ?? new EmptyScoringService(),
      standings: customServices?.standings ?? new EmptyStandingsService(),
      authView: customServices?.authView ?? new EmptyAuthViewService(),
      isDemoMode: false,
    };
  }, [customServices, isDemoMode]);

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
};

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return ctx;
}
