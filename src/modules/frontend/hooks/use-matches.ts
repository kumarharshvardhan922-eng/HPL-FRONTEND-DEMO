"use client";

import { useEffect, useState, useCallback } from "react";
import { Match, MatchStatus, SportId } from "../types";
import { useServices } from "../providers";

export interface UseMatchesFilter {
  sportId?: SportId;
  status?: MatchStatus;
  teamId?: string;
  date?: string;
  search?: string;
}

export function useMatches(filter?: UseMatchesFilter) {
  const { matches: matchesService } = useServices();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sportId = filter?.sportId;
  const status = filter?.status;
  const teamId = filter?.teamId;
  const date = filter?.date;
  const search = filter?.search;

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await matchesService.getMatches({ sportId, status, teamId, date, search });
      setMatches(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load matches.");
    } finally {
      setIsLoading(false);
    }
  }, [matchesService, sportId, status, teamId, date, search]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, isLoading, error, refetch: fetchMatches };
}
