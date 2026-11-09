"use client";

import { useEffect, useState } from "react";
import { Match } from "../types";
import { useServices } from "../providers";

export function useLiveMatch(matchId: string) {
  const { matches: matchesService, scoring: scoringService } = useServices();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    matchesService
      .getMatchById(matchId)
      .then((m) => {
        if (isMounted) {
          setMatch(m);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load match.");
          setIsLoading(false);
        }
      });

    // Authoritative real-time event subscription via scoring service
    const unsubscribe = scoringService.subscribeLiveMatch(matchId, (updatedMatch) => {
      if (isMounted) {
        setMatch(updatedMatch);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [matchId, matchesService, scoringService]);

  return {
    match,
    isLoading,
    error,
    isLive: match?.status === "live",
    lastUpdated: match?.lastUpdated || new Date().toISOString(),
  };
}
