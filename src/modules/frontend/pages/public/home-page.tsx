"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSports, useMatches, useTeams, useStandings } from "../../hooks";
import { useServices } from "../../providers";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Award, ChevronRight } from "lucide-react";
import { SportId } from "../../types";
import { HomeHero } from "./home-hero";
import { SHOWCASE_TOP_PERFORMER } from "../../showcase/showcase";
import {
  SportChipRow,
  LiveMatchCarousel,
  MatchRow,
} from "../../components/scoreboards";

export const HomePage: React.FC = () => {
  const { isDemoMode } = useServices();
  const { sports } = useSports();
  const { matches, isLoading: matchesLoading } = useMatches();
  const { teams } = useTeams();
  const [selectedSport, setSelectedSport] = useState<SportId | "all">("all");
  const { standings } = useStandings(selectedSport === "all" ? "cricket" : selectedSport);

  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  // Filtered by selected sport chip
  const filteredMatches = selectedSport === "all"
    ? matches
    : matches.filter((m) => m.sportId === selectedSport);

  const liveMatches = filteredMatches.filter((m) => m.status === "live");
  const nonLiveMatches = filteredMatches.filter((m) => m.status !== "live").slice(0, 6);

  return (
    <div className="space-y-8 pb-16">
      <HomeHero />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Sport Chip Row */}
        <section aria-label="Sport selection">
          <SportChipRow
            sports={sports}
            selectedSportId={selectedSport}
            onSelectSport={(id) => setSelectedSport(id as SportId | "all")}
            includeAll={true}
            allLabel="All Sports"
          />
        </section>

        {/* Live Match Carousel Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hpl-live opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hpl-live" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
                Live Match
              </h2>
            </div>
            {liveMatches.length > 0 && (
              <span className="text-xs text-hpl-muted font-medium">
                {liveMatches.length} Live
              </span>
            )}
          </div>

          <LiveMatchCarousel
            matches={liveMatches}
            teamsMap={teamsMap}
            isLoading={matchesLoading}
          />
        </section>

        {/* Matches List Section with "See all" */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
              Matches
            </h2>
            <Link
              href="/fixtures"
              className="text-xs font-semibold text-hpl-accent hover:text-hpl-accent-soft flex items-center gap-0.5 transition-colors"
            >
              <span>See all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {matchesLoading ? (
            <div className="space-y-3">
              <div className="h-16 rounded-2xl bg-[rgba(11,26,40,0.78)] animate-pulse" />
              <div className="h-16 rounded-2xl bg-[rgba(11,26,40,0.78)] animate-pulse" />
              <div className="h-16 rounded-2xl bg-[rgba(11,26,40,0.78)] animate-pulse" />
            </div>
          ) : nonLiveMatches.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[rgba(11,26,40,0.78)] backdrop-blur-md border border-hpl-border text-center text-xs text-hpl-muted">
              No matches currently scheduled for this selection.
            </div>
          ) : (
            <div className="space-y-2.5">
              {nonLiveMatches.map((m) => (
                <MatchRow
                  key={m.id}
                  match={m}
                  teamA={teamsMap[m.teamAId]}
                  teamB={teamsMap[m.teamBId]}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sport Standings & MVP Grid */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
              Points Table & Leaderboard
            </h2>
            <Link
              href="/standings"
              className="text-xs font-semibold text-hpl-accent hover:text-hpl-accent-soft flex items-center gap-0.5"
            >
              <span>Full Standings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="text-sm font-bold capitalize text-white flex items-center justify-between">
                    <span>{selectedSport === "all" ? "Cricket" : selectedSport} Standings</span>
                    {standings.some((s) => s.isDemo) && (
                      <Badge variant="warning" size="sm">Demo Data</Badge>
                    )}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-hpl-gold" />
                    <h3 className="text-sm font-bold text-white font-display">House MVP Spotlight</h3>
                  </div>
                  {isDemoMode && <Badge variant="warning" size="sm">Demo Data</Badge>}
                </div>

                {isDemoMode ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-hpl-surface-2 rounded-xl border border-hpl-border">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {SHOWCASE_TOP_PERFORMER.houseCode}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{SHOWCASE_TOP_PERFORMER.name}</div>
                        <div className="text-[10px] text-hpl-muted">
                          {SHOWCASE_TOP_PERFORMER.houseName} • {SHOWCASE_TOP_PERFORMER.sport} ({SHOWCASE_TOP_PERFORMER.highlight})
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-hpl-surface-2 rounded-xl border border-hpl-border text-center text-xs text-hpl-muted">
                    No MVP awards logged yet. Player highlights will appear here after matches conclude.
                  </div>
                )}

                <Link href="/standings" className="block text-center text-xs font-bold text-hpl-accent hover:text-hpl-accent-soft pt-1">
                  Full Leaderboard & Standings →
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
