"use client";

import { useEffect, useState, useRef } from "react";
import { Match } from "../types";
import { useServices } from "../providers";

export function useLiveMatch(matchId: string) {
  const { matches: matchesService, scoring: scoringService } = useServices();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tickerRef = useRef<NodeJS.Timeout | null>(null);

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

    // Subscribe to real-time events via scoring service
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

  // Live simulation ticker for demonstration when status is "live"
  useEffect(() => {
    if (match?.status !== "live") {
      if (tickerRef.current) clearInterval(tickerRef.current);
      return;
    }

    tickerRef.current = setInterval(() => {
      setMatch((prev) => {
        if (!prev || prev.status !== "live") return prev;
        const updated = JSON.parse(JSON.stringify(prev)) as Match;
        updated.lastUpdated = new Date().toISOString();

        if (updated.sportId === "football" && updated.scoreState.sportId === "football") {
          updated.scoreState.matchTimeMinutes = Math.min(90, updated.scoreState.matchTimeMinutes + 1);
        } else if (updated.sportId === "cricket" && updated.scoreState.sportId === "cricket") {
          // Increment balls
          const balls = updated.scoreState.ballsA + 1;
          if (balls >= 6) {
            updated.scoreState.oversA += 1;
            updated.scoreState.ballsA = 0;
          } else {
            updated.scoreState.ballsA = balls;
          }
        }
        return updated;
      });
    }, 6000);

    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [match?.status, match?.sportId]);

  return {
    match,
    isLoading,
    error,
    isLive: match?.status === "live",
    lastUpdated: match?.lastUpdated || new Date().toISOString(),
  };
}

