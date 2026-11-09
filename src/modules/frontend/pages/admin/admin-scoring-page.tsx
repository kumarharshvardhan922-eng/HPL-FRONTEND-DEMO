"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Match, Team } from "../../types";
import { useServices } from "../../providers";
import { useAuthView } from "../../providers/auth-view-provider";
import {
  CricketAdminConsole,
  FootballAdminConsole,
  KabaddiAdminConsole,
  BadmintonAdminConsole,
  VolleyballAdminConsole,
  BasketballAdminConsole,
} from "../../components/scoreboards";
import { EventsTimeline } from "../../components/scoreboards/events-timeline";
import { ScoreboardSkeleton } from "../../components/ui/skeleton";
import { ErrorState } from "../../components/ui/error-state";
import { Button } from "../../components/ui/button";
import { ArrowLeft, ShieldAlert, Eye } from "lucide-react";

export interface AdminScoringPageProps {
  matchId: string;
}

export const AdminScoringPage: React.FC<AdminScoringPageProps> = ({ matchId }) => {
  const { matches: matchesService, teams: teamsService } = useServices();
  const { role, isPermittedForSport } = useAuthView();

  const [match, setMatch] = useState<Match | null>(null);
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchData = useCallback(async () => {
    try {
      const m = await matchesService.getMatchById(matchId);
      setMatch(m);
      const [tA, tB] = await Promise.all([
        teamsService.getTeamById(m.teamAId).catch(() => null),
        teamsService.getTeamById(m.teamBId).catch(() => null),
      ]);
      setTeamA(tA);
      setTeamB(tB);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load match scoring state.");
    } finally {
      setIsLoading(false);
    }
  }, [matchId, matchesService, teamsService]);

  useEffect(() => {
    fetchMatchData();
  }, [fetchMatchData]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <ScoreboardSkeleton />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorState message={error || "Match not found."} />
        <div className="text-center mt-4">
          <Link href="/admin/fixtures">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Fixtures
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Permission Guard: Sport Admin must be permitted for this sport
  if (!isPermittedForSport(match.sportId)) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-hpl-surface-2 text-hpl-gold flex items-center justify-center mx-auto border border-hpl-gold/30">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">No Access</h2>
        <p className="text-xs text-hpl-muted">
          You are signed in as a Sport Admin without scoring delegation for{" "}
          <span className="font-bold uppercase text-hpl-accent">{match.sportId}</span>. Please request access from the Super Admin.
        </p>
        <div className="pt-2">
          <Link href="/admin">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/fixtures"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-hpl-accent hover:text-hpl-accent-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Scoring Console</span>
        </Link>
        <Link href={`/matches/${match.id}`} target="_blank">
          <Button variant="outline" size="sm" className="text-white border-hpl-border">
            <Eye className="w-4 h-4 mr-1.5 text-hpl-accent" />
            Open Public View
          </Button>
        </Link>
      </div>

      {/* Sport-Specific Interactive Admin Console */}
      {match.sportId === "cricket" && (
        <CricketAdminConsole match={match} teamA={teamA || undefined} teamB={teamB || undefined} onScoreUpdated={fetchMatchData} />
      )}
      {match.sportId === "football" && (
        <FootballAdminConsole match={match} teamA={teamA || undefined} teamB={teamB || undefined} onScoreUpdated={fetchMatchData} />
      )}
      {match.sportId === "kabaddi" && (
        <KabaddiAdminConsole match={match} teamA={teamA || undefined} teamB={teamB || undefined} onScoreUpdated={fetchMatchData} />
      )}
      {match.sportId === "badminton" && (
        <BadmintonAdminConsole match={match} teamA={teamA || undefined} teamB={teamB || undefined} onScoreUpdated={fetchMatchData} />
      )}
      {match.sportId === "volleyball" && (
        <VolleyballAdminConsole match={match} teamA={teamA || undefined} teamB={teamB || undefined} onScoreUpdated={fetchMatchData} />
      )}
      {match.sportId === "basketball" && (
        <BasketballAdminConsole match={match} teamA={teamA || undefined} teamB={teamB || undefined} onScoreUpdated={fetchMatchData} />
      )}

      {/* Audit Log / Scoring Events Feed */}
      <EventsTimeline events={match.events} isLive={match.status === "live"} />
    </div>
  );
};
