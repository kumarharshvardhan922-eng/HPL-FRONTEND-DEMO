"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Team, Player, Match } from "../../types";
import { useServices } from "../../providers";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { ArrowLeft, Users2 } from "lucide-react";
import { getInitials } from "../../utils/formatters";

export interface TeamDetailPageProps {
  teamId: string;
}

export const TeamDetailPage: React.FC<TeamDetailPageProps> = ({ teamId }) => {
  const { teams: teamsService, players: playersService, matches: matchesService } = useServices();
  const [team, setTeam] = useState<Team | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [teamMatches, setTeamMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      teamsService.getTeamById(teamId),
      playersService.getPlayers({ teamId }),
      matchesService.getMatches({ teamId }),
    ])
      .then(([t, p, m]) => {
        if (isMounted) {
          setTeam(t);
          setSquad(p);
          setTeamMatches(m);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load house details.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [teamId, teamsService, playersService, matchesService]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error || "House not found."} />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/teams" className="inline-flex items-center gap-1.5 text-xs font-semibold text-hpl-accent hover:text-hpl-accent-soft">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Houses</span>
      </Link>

      {/* House Header Banner */}
      <div className="bg-hpl-surface text-white p-6 sm:p-8 rounded-2xl shadow-card border border-hpl-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-hpl-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-lg shrink-0 border border-white/20 select-none"
              style={{ backgroundColor: team.primaryColor || "#38b6ff" }}
            >
              {team.shortName || getInitials(team.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-hpl-surface-2 text-hpl-accent border border-hpl-border">
                  {team.shortName}
                </span>
                <span className="text-xs text-hpl-muted font-medium">{team.hostelBlock}</span>
                {team.isDemo && <Badge variant="warning" size="sm">Demo Data</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1 leading-tight font-display text-white">{team.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-hpl-surface-2 border border-hpl-border text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase text-hpl-accent block">Athletes</span>
              <span className="text-xl font-black font-mono text-white">{squad.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-hpl-surface-2 border border-hpl-border text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase text-hpl-accent block">Fixtures</span>
              <span className="text-xl font-black font-mono text-white">{teamMatches.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Table */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="w-5 h-5 text-hpl-accent" />
              <span>Registered Squad Roster</span>
            </div>
            <span className="text-xs font-normal text-hpl-muted">{squad.length} registered players</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {squad.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No athletes registered for this house"
                description="This house currently has no active player roster allocated in the tournament database."
                actionLabel="Add Player (Admin)"
                onAction={() => {
                  window.location.href = "/admin/players";
                }}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-hpl-accent">#</TableHead>
                  <TableHead className="text-hpl-accent">Athlete</TableHead>
                  <TableHead className="text-hpl-accent">Sport</TableHead>
                  <TableHead className="text-hpl-accent">Playing Position</TableHead>
                  <TableHead className="text-right text-hpl-accent">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {squad.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-bold text-hpl-gold">#{p.jerseyNumber}</TableCell>
                    <TableCell className="font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-hpl-surface-2 text-hpl-accent border border-hpl-border flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(p.name)}
                        </div>
                        <span>{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-hpl-accent-soft font-medium">{p.sportId}</TableCell>
                    <TableCell className="text-hpl-muted text-xs">{p.role}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/players/${p.id}`}>
                        <Button variant="ghost" size="sm" className="text-hpl-accent hover:text-white">
                          Profile →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
