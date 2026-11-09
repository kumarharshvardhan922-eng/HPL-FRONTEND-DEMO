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
  MockAuthViewService,
  MockMatchesService,
  MockPlayersService,
  MockScoringService,
  MockSportsService,
  MockStandingsService,
  MockTeamsService,
} from "../services";

export interface ServicesContextValue {
  sports: SportsService;
  teams: TeamsService;
  players: PlayersService;
  matches: MatchesService;
  scoring: ScoringService;
  standings: StandingsService;
  authView: AuthViewService;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

export interface ServicesProviderProps {
  children: React.ReactNode;
  customServices?: Partial<ServicesContextValue>;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({ children, customServices }) => {
  // Single-point service factory: easily swapped for real API implementations
  const services = useMemo<ServicesContextValue>(() => {
    return {
      sports: customServices?.sports ?? new MockSportsService(),
      teams: customServices?.teams ?? new MockTeamsService(),
      players: customServices?.players ?? new MockPlayersService(),
      matches: customServices?.matches ?? new MockMatchesService(),
      scoring: customServices?.scoring ?? new MockScoringService(),
      standings: customServices?.standings ?? new MockStandingsService(),
      authView: customServices?.authView ?? new MockAuthViewService(),
    };
  }, [customServices]);

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
};

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return ctx;
}

