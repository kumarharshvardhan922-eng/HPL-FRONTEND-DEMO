"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSports, useMatches, useTeams, useStandings } from "../../hooks";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Award } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";
import { SportId } from "../../types";
import { HomeHero } from "./home-hero";
import { HomeLiveCard } from "./home-live-card";

export const HomePage: React.FC = () => {
  const { sports } = useSports();
  const { matches, isLoading: matchesLoading } = useMatches();
  const { teams } = useTeams();
  const [selectedSport, setSelectedSport] = useState<SportId>("cricket");
  const { standings } = useStandings(selectedSport);

  const liveMatches = matches.filter((m) => m.status === "live");
  const upcomingMatches = matches.filter((m) => m.status === "upcoming").slice(0, 4);
  const recentResults = matches.filter((m) => m.status === "completed").slice(0, 4);

  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div className="space-y-10 pb-16">
      <HomeHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Live-Now Strip */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hpl-live opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-hpl-live" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
                Live Matches Right Now
              </h2>
            </div>
            <span className="text-xs text-hpl-muted">{liveMatches.length} Matches in progress</span>
          </div>

          {matchesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          ) : liveMatches.length === 0 ? (
            <div className="p-8 rounded-2xl bg-hpl-surface border border-hpl-border text-center text-hpl-muted text-sm">
              No live matches currently underway. Check fixtures for upcoming schedule.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveMatches.map((m) => (
                <HomeLiveCard
                  key={m.id}
                  match={m}
                  teamA={teamsMap[m.teamAId]}
                  teamB={teamsMap[m.teamBId]}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sport Switcher & Mini Standings */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
              Points Table & Leaderboard
            </h2>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-hpl-surface-2 rounded-2xl border border-hpl-border">
              {sports.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSport(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all select-none ${
                    selectedSport === s.id
                      ? "bg-hpl-accent text-hpl-deep shadow-glow"
                      : "text-hpl-muted hover:text-white hover:bg-hpl-surface"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="text-sm font-bold capitalize text-white">
                    {selectedSport} Points Table
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-hpl-surface-2 border-b border-hpl-border text-[10px] font-bold uppercase text-hpl-accent">
                      <tr>
                        <th className="px-4 py-2.5">Rank</th>
                        <th className="px-4 py-2.5">House</th>
                        <th className="px-3 py-2.5 text-right">P</th>
                        <th className="px-3 py-2.5 text-right">W</th>
                        <th className="px-3 py-2.5 text-right">L</th>
                        <th className="px-4 py-2.5 text-right font-black">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hpl-border/60">
                      {standings.slice(0, 5).map((s, idx) => (
                        <tr key={s.teamId} className="hover:bg-hpl-surface-2/70 transition-colors">
                          <td className="px-4 py-2.5 font-bold text-hpl-gold font-mono">#{idx + 1}</td>
                          <td className="px-4 py-2.5 font-bold text-white font-display text-sm">{s.teamName}</td>
                          <td className="px-3 py-2.5 text-right text-hpl-muted font-mono">{s.played}</td>
                          <td className="px-3 py-2.5 text-right text-hpl-success font-bold font-mono">{s.won}</td>
                          <td className="px-3 py-2.5 text-right text-hpl-live font-mono">{s.lost}</td>
                          <td className="px-4 py-2.5 text-right font-black text-white font-mono text-sm">{s.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers Spotlight */}
            <div>
              <Card variant="default" className="p-5 space-y-4 bg-hpl-surface border-hpl-border">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-hpl-gold" />
                  <h3 className="text-sm font-bold text-white font-display">House MVP Spotlight</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-hpl-surface-2 rounded-xl border border-hpl-border">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      AL
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Aarav Sharma</div>
                      <div className="text-[10px] text-hpl-muted">Arkavati Lions • Cricket Striker (160.8 SR)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-hpl-surface-2 rounded-xl border border-hpl-border">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      HJ
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Kabir Verma</div>
                      <div className="text-[10px] text-hpl-muted">Harangi Jaguars • Football Midfielder (8.4 Rating)</div>
                    </div>
                  </div>
                </div>
                <Link href="/standings" className="block text-center text-xs font-bold text-hpl-accent hover:text-hpl-accent-soft pt-1">
                  Full Leaderboard & Standings →
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming & Recent Results */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Upcoming Matches</span>
                <Link href="/fixtures" className="text-xs font-normal text-hpl-accent hover:underline">
                  All Fixtures
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMatches.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-hpl-surface-2 border border-hpl-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">
                      {teamsMap[m.teamAId]?.shortName || "A"} vs {m.teamBId === "bye" ? "BYE" : teamsMap[m.teamBId]?.shortName || "B"}
                    </span>
                    <div className="text-[10px] text-hpl-muted capitalize">{m.sportId} • {m.venue}</div>
                  </div>
                  <span className="font-mono text-hpl-accent font-semibold">{formatDateTime(m.startTime)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Recent Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentResults.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-hpl-surface-2 border border-hpl-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">
                      {teamsMap[m.teamAId]?.name || "A"} vs {teamsMap[m.teamBId]?.name || "B"}
                    </span>
                    <div className="text-[10px] text-hpl-muted">{m.resultSummary || "Completed Match"}</div>
                  </div>
                  <Badge variant="completed" size="sm">FT</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
