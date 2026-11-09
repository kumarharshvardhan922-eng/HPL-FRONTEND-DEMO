"use client";

import React from "react";
import Link from "next/link";
import { useSports, useTeams, useMatches } from "../../hooks";
import { useAuthView } from "../../providers/auth-view-provider";
import { canAccessSport } from "../../utils/permissions";
import { HPL_SPORTS } from "../../config/sports";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Trophy, Users2, Activity, CalendarDays, ShieldCheck, Clock } from "lucide-react";

export const AdminOverviewPage: React.FC = () => {
  const { sports } = useSports();
  const { teams } = useTeams();
  const { matches } = useMatches();
  const { currentUser, role, assignedSportIds, isPermittedForSport } = useAuthView();

  const assignedSport =
    role === "sport_admin" && assignedSportIds[0]
      ? HPL_SPORTS.find((s) => s.id === assignedSportIds[0])
      : null;

  // Filter matches and sports strictly according to permissions
  const scopedMatches =
    role === "super_admin"
      ? matches
      : matches.filter((m) => canAccessSport(currentUser, m.sportId));

  const liveMatches = scopedMatches.filter((m) => m.status === "live");
  const upcomingMatches = scopedMatches.filter((m) => m.status === "upcoming");
  const totalPlayersCount = teams.reduce((acc, t) => acc + t.playerIds.length, 0);

  // Filter sports for Sport Admin view
  const visibleSportsList =
    role === "super_admin"
      ? sports
      : sports.filter((s) => canAccessSport(currentUser, s.id));
  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-hpl-surface text-white p-6 sm:p-8 rounded-2xl shadow-card border border-hpl-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-hpl-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-hpl-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-hpl-accent font-display">
                Logged in as {role === "sport_admin" ? `Sport Admin (${assignedSport?.name || "Scoped"})` : role.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">Tournament Command Centre</h1>
            <p className="text-xs sm:text-sm text-hpl-muted">
              {role === "super_admin"
                ? "Full administrative control across all 6 sports, 7 houses, rosters, and scoring consoles."
                : `Scoped scoring access for assigned discipline: ${assignedSport?.name || assignedSportIds.join(", ")}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/fixtures">
              <Button variant="primary" size="sm" className="shadow-glow">
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Schedule Match
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-5 bg-hpl-surface border-hpl-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-hpl-accent">Disciplines</span>
            <Trophy className="w-5 h-5 text-hpl-accent" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">{visibleSportsList.length}</div>
          <span className="text-[11px] text-hpl-muted mt-1 block">Active sports tracked</span>
        </Card>

        <Card variant="default" className="p-5 bg-hpl-surface border-hpl-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-hpl-gold">Championship Houses</span>
            <Users2 className="w-5 h-5 text-hpl-gold" />
          </div>
          <div className="text-3xl font-black font-mono text-hpl-gold mt-2">{teams.length}</div>
          <span className="text-[11px] text-hpl-muted mt-1 block">{totalPlayersCount} registered athletes</span>
        </Card>

        <Card variant="default" className="p-5 bg-hpl-surface border-hpl-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-hpl-live">Live Matches</span>
            <Activity className="w-5 h-5 text-hpl-live" />
          </div>
          <div className="text-3xl font-black font-mono text-hpl-live mt-2">{liveMatches.length}</div>
          <span className="text-[11px] text-hpl-muted mt-1 block">Requiring scoring operator</span>
        </Card>

        <Card variant="default" className="p-5 bg-hpl-surface border-hpl-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-hpl-accent-soft">Upcoming</span>
            <Clock className="w-5 h-5 text-hpl-accent-soft" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">{upcomingMatches.length}</div>
          <span className="text-[11px] text-hpl-muted mt-1 block">Scheduled on calendar</span>
        </Card>
      </div>

      {/* Live Match Scoring Shortcuts */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-hpl-live" />
              <span>Active Scoring Consoles</span>
            </div>
            <span className="text-xs font-normal text-hpl-muted">Tap to operate live score sheet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {liveMatches.length === 0 ? (
            <p className="text-xs text-hpl-muted">No active live matches right now.</p>
          ) : (
            liveMatches.map((m) => {
              const allowed = isPermittedForSport(m.sportId);
              const nameA = teamsMap[m.teamAId]?.name || m.teamAId;
              const nameB = teamsMap[m.teamBId]?.name || m.teamBId;

              return (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-hpl-surface-2 border border-hpl-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-hpl-surface text-hpl-accent border border-hpl-border">
                        {m.sportId}
                      </span>
                      <Badge variant="live" size="sm">LIVE</Badge>
                      <span className="text-xs text-hpl-muted font-medium">{m.round} • {m.venue}</span>
                    </div>
                    <div className="text-sm font-bold text-white font-display">
                      {nameA} vs {nameB}
                    </div>
                  </div>

                  <div>
                    {allowed ? (
                      <Link href={`/admin/scoring/${m.id}`}>
                        <Button variant="primary" size="sm" className="shadow-glow">
                          Open Scoring Console →
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="opacity-50">
                        Restricted (Assigned Admin Only)
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
