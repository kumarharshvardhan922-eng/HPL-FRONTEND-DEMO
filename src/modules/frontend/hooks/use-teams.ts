"use client";

import { useEffect, useState, useCallback } from "react";
import { Team } from "../types";
import { useServices } from "../providers";

export function useTeams(search?: string) {
  const { teams: teamsService } = useServices();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await teamsService.getTeams(search ? { search } : undefined);
      setTeams(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load teams.");
    } finally {
      setIsLoading(false);
    }
  }, [teamsService, search]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return { teams, isLoading, error, refetch: fetchTeams };
}

