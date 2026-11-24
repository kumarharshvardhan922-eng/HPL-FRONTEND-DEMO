"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSports, useMatches, useTeams, useStandings } from "../../hooks";
import { SportId } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Tabs } from "../../components/ui/tabs";
import { SearchBar } from "../../components/ui/search-bar";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Trophy } from "lucide-react";
import { SportChipRow, MatchRow } from "../../components/scoreboards";

export interface SportPageProps {
  sportId: SportId;
}

export const SportPage: React.FC<SportPageProps> = ({ sportId }) => {
  const router = useRouter();
  const { sports } = useSports();
  const { matches, isLoading: matchesLoading, error, refetch } = useMatches({ sportId });
  const { teams } = useTeams();
  const { standings } = useStandings(sportId);

  const [activeTab, setActiveTab] = useState<string>("live");
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const sport = sports.find((s) => s.id === sportId) || {
    id: sportId,
    name: sportId.toUpperCase(),
    description: "Inter-House championship discipline",
    rulesSummary: "Official tournament guidelines and regulations",
  };

  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  const filteredMatches = matches.filter((m) => {
    if (activeTab === "live" && m.status !== "live") return false;
    if (activeTab === "upcoming" && m.status !== "upcoming") return false;
    if (activeTab === "completed" && m.status !== "completed") return false;
    if (selectedTeam && m.teamAId !== selectedTeam && m.teamBId !== selectedTeam) return false;
    if (search) {
      const q = search.toLowerCase();
      const tAName = teamsMap[m.teamAId]?.name.toLowerCase() || "";
      const tBName = teamsMap[m.teamBId]?.name.toLowerCase() || "";
      return tAName.includes(q) || tBName.includes(q) || m.venue.toLowerCase().includes(q);
    }
    return true;
  });

  const tabs = [
    { id: "live", label: "Live Matches", badge: matches.filter((m) => m.status === "live").length },
    { id: "upcoming", label: "Upcoming", badge: matches.filter((m) => m.status === "upcoming").length },
    { id: "completed", label: "Completed", badge: matches.filter((m) => m.status === "completed").length },
    { id: "standings", label: "Points Table" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Sport Navigation Chip Row */}
      <SportChipRow
        sports={sports}
        selectedSportId={sportId}
        onSelectSport={(id) => {
          if (id !== "all") router.push(`/sports/${id}`);
          else router.push("/fixtures");
        }}
        includeAll={true}
        allLabel="All Sports"
      />

      {/* Sport Title & Rules Summary Card */}
      <div className="bg-[rgba(11,26,40,0.78)] text-white p-6 sm:p-7 rounded-2xl shadow-card border border-hpl-border relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-hpl-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-hpl-gold" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-hpl-accent">Championship Discipline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black capitalize tracking-tight font-display text-white">
              {sport.name}
            </h1>
            <p className="text-xs text-hpl-muted leading-relaxed">{sport.description}</p>
          </div>
          <div className="bg-hpl-surface-2/80 p-3.5 rounded-xl border border-hpl-border max-w-sm">
            <span className="text-[10px] font-bold uppercase text-hpl-accent tracking-wider font-display">
              Tournament Rules
            </span>
            <p className="text-xs text-hpl-muted mt-1">{sport.rulesSummary}</p>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {activeTab !== "standings" && (
            <div className="flex items-center gap-2">
              <SearchBar value={search} onChange={setSearch} placeholder="Search houses, venue..." />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 rounded-xl border border-hpl-border bg-hpl-surface-2 text-xs text-white shadow-card focus:outline-none focus:border-hpl-accent"
              >
                <option value="" className="bg-hpl-surface text-white">All Houses</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-hpl-surface text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content Area */}
        {matchesLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : activeTab === "standings" ? (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-sm font-bold capitalize text-white">
                {sport.name} Standings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-hpl-accent">Rank</TableHead>
                    <TableHead className="text-hpl-accent">House</TableHead>
                    <TableHead className="text-right text-hpl-accent">Played</TableHead>
                    <TableHead className="text-right text-hpl-accent">Won</TableHead>
                    <TableHead className="text-right text-hpl-accent">Lost</TableHead>
                    <TableHead className="text-right text-hpl-accent">Tied</TableHead>
                    <TableHead className="text-right font-black text-hpl-accent">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((s, idx) => (
                    <TableRow key={s.teamId}>
                      <TableCell className="font-bold text-hpl-gold font-mono">#{idx + 1}</TableCell>
                      <TableCell className="font-bold text-white font-display text-sm">{s.teamName}</TableCell>
                      <TableCell className="text-right font-mono text-hpl-muted">{s.played}</TableCell>
                      <TableCell className="text-right font-mono text-hpl-success font-bold">{s.won}</TableCell>
                      <TableCell className="text-right font-mono text-hpl-live">{s.lost}</TableCell>
                      <TableCell className="text-right font-mono text-hpl-muted">{s.tied}</TableCell>
                      <TableCell className="text-right font-mono font-black text-white text-sm">{s.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : filteredMatches.length === 0 ? (
          <EmptyState
            title={`No ${activeTab} matches found`}
            description="Try modifying search criteria or switch between Live, Upcoming, and Completed tabs."
          />
        ) : (
          <div className="space-y-2.5">
            {filteredMatches.map((m) => (
              <MatchRow
                key={m.id}
                match={m}
                teamA={teamsMap[m.teamAId]}
                teamB={teamsMap[m.teamBId]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
