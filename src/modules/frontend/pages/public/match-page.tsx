"use client";

import React from "react";
import Link from "next/link";
import { useLiveMatch, useTeams, useStandings } from "../../hooks";
import { useAuthView } from "../../providers/auth-view-provider";
import {
  CricketPublicScoreboard,
  FootballPublicScoreboard,
  KabaddiPublicScoreboard,
  BadmintonPublicScoreboard,
  VolleyballPublicScoreboard,
  BasketballPublicScoreboard,
} from "../../components/scoreboards";
import { ScoreboardSkeleton } from "../../components/ui/skeleton";
import { ErrorState } from "../../components/ui/error-state";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Edit3, Clock } from "lucide-react";
import { formatTimeOnly } from "../../utils/formatters";

export interface MatchPageProps {
  matchId: string;
}

export const MatchPage: React.FC<MatchPageProps> = ({ matchId }) => {
  const { match, isLoading, error, lastUpdated } = useLiveMatch(matchId);
  const { teams } = useTeams();
  const { isPermittedForSport } = useAuthView();
  const { standings } = useStandings(match?.sportId || "cricket");

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <ScoreboardSkeleton />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          title="Match Not Found"
          message={error || "The requested match could not be retrieved from the tournament database."}
        />
        <div className="text-center mt-6">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const teamA = teams.find((t) => t.id === match.teamAId);
  const teamB = teams.find((t) => t.id === match.teamBId);
  const canScore = isPermittedForSport(match.sportId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back breadcrumb and live sync bar */}
      <div className="flex items-center justify-between">
        <Link
          href={`/sports/${match.sportId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-hpl-accent hover:text-hpl-accent-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {match.sportId.toUpperCase()} Matches</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-hpl-muted flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-hpl-accent" />
            Last updated: {formatTimeOnly(lastUpdated)}
          </span>
          {canScore && (
            <Link href={`/admin/scoring/${match.id}`}>
              <Button variant="primary" size="sm" className="shadow-glow">
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                Scoring Console
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Dynamic Sport-Specific Live Scoreboard */}
      {match.sportId === "cricket" && (
        <CricketPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
      )}
      {match.sportId === "football" && (
        <FootballPublicScoreboard match={match} teamA={teamA} teamB={teamB} standings={standings} />
      )}
      {match.sportId === "kabaddi" && (
        <KabaddiPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
      )}
      {match.sportId === "badminton" && (
        <BadmintonPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
      )}
      {match.sportId === "volleyball" && (
        <VolleyballPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
      )}
      {match.sportId === "basketball" && (
        <BasketballPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
      )}
    </div>
  );
};
