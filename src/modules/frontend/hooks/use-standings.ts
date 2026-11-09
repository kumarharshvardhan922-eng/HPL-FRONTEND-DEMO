"use client";

import { useEffect, useState, useCallback } from "react";
import { SportId, Standing } from "../types";
import { useServices } from "../providers";

export function useStandings(sportId: SportId) {
  const { standings: standingsService } = useServices();
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStandings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await standingsService.getStandings(sportId);
      setStandings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load standings.");
    } finally {
      setIsLoading(false);
    }
  }, [standingsService, sportId]);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return { standings, isLoading, error, refetch: fetchStandings };
}

