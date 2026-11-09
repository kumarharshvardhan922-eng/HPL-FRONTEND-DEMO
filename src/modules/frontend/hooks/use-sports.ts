"use client";

import { useEffect, useState, useCallback } from "react";
import { Sport } from "../types";
import { useServices } from "../providers";

export function useSports() {
  const { sports: sportsService } = useServices();
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sportsService.getSports();
      setSports(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load sports.");
    } finally {
      setIsLoading(false);
    }
  }, [sportsService]);

  useEffect(() => {
    fetchSports();
  }, [fetchSports]);

  return { sports, isLoading, error, refetch: fetchSports };
}

