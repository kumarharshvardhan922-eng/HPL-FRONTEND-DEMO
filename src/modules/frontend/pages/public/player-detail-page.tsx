"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Player, Team } from "../../types";
import { useServices } from "../../providers";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { ErrorState } from "../../components/ui/error-state";
import { ArrowLeft } from "lucide-react";
import { getInitials } from "../../utils/formatters";

export interface PlayerDetailPageProps {
  playerId: string;
}

export const PlayerDetailPage: React.FC<PlayerDetailPageProps> = ({ playerId }) => {
  const { players: playersService, teams: teamsService } = useServices();
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    playersService
      .getPlayerById(playerId)
      .then(async (p) => {
        if (!isMounted) return;
        setPlayer(p);
        const t = await teamsService.getTeamById(p.teamId);
        if (isMounted) {
          setTeam(t);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load player.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [playerId, playersService, teamsService]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error || "Player profile not found."} />
        <div className="text-center mt-6">
          <Link href="/teams">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Houses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {team && (
        <Link
          href={`/teams/${team.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-hpl-accent hover:text-hpl-accent-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {team.name} Squad</span>
        </Link>
      )}

      {/* Player Header Banner */}
      <div className="bg-hpl-surface text-white p-6 sm:p-8 rounded-2xl shadow-card border border-hpl-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-hpl-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-hpl-surface-2 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg border border-white/20">
              {getInitials(player.name)}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-hpl-gold text-hpl-deep font-black text-xs px-2 py-0.5 rounded-full border border-amber-600">
              #{player.jerseyNumber}
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-hpl-surface-2 text-hpl-accent border border-hpl-border">
                {player.sportId}
              </span>
              <span className="text-xs text-hpl-muted font-medium">{player.role}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-white">{player.name}</h1>
            <p className="text-xs sm:text-sm text-hpl-muted">
              {team ? `${team.name} (${team.hostelBlock})` : "House Athlete"}
            </p>
          </div>
        </div>
      </div>

      {/* Career & Season Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <span className="text-[11px] font-bold uppercase text-hpl-accent">Matches Played</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
            {player.stats?.matches || 5}
          </div>
        </Card>
        <Card variant="default" className="p-4 text-center bg-hpl-surface border-hpl-border">
          <span className="text-[11px] font-bold uppercase text-hpl-gold">MVP Honors</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-hpl-gold mt-1">
            {player.stats?.mvpAwards || 0}
          </div>
        </Card>
        <Card variant="default" className="p-4 text-center col-span-2 sm:col-span-1 bg-hpl-surface border-hpl-border">
          <span className="text-[11px] font-bold uppercase text-hpl-accent-soft">Performance Index</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
            {player.stats?.performanceRating || "7.8"} / 10
          </div>
        </Card>
      </div>
    </div>
  );
};
