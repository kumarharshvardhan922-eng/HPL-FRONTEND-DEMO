"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSports, useMatches, useTeams, useStandings } from "../../hooks";
import { SportId } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs } from "../../components/ui/tabs";
import { SearchBar } from "../../components/ui/search-bar";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Trophy, ArrowRight } from "lucide-react";
import { formatDateTime, getInitials } from "../../utils/formatters";

export interface SportPageProps {
  sportId: SportId;
}

export const SportPage: React.FC<SportPageProps> = ({ sportId }) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sport Title & Rules Summary Card */}
      <div className="bg-hpl-surface text-white p-6 sm:p-8 rounded-2xl shadow-card border border-hpl-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-hpl-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-hpl-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-hpl-accent">Sport Discipline</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black capitalize tracking-tight font-display text-white">
              {sport.name} Championship
            </h1>
            <p className="text-xs sm:text-sm text-hpl-muted leading-relaxed">{sport.description}</p>
          </div>
          <div className="bg-hpl-surface-2 p-4 rounded-xl border border-hpl-border max-w-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((m) => {
              const tA = teamsMap[m.teamAId];
              const tB = teamsMap[m.teamBId];
              const codeA = tA?.shortName || getInitials(tA?.name || m.teamAId);
              const isBye = m.teamBId === "bye";
              const codeB = isBye ? "BYE" : tB?.shortName || getInitials(tB?.name || m.teamBId);

              const scoreA =
                "runsA" in m.scoreState
                  ? `${m.scoreState.runsA}/${m.scoreState.wicketsA}`
                  : "goalsA" in m.scoreState
                  ? m.scoreState.goalsA
                  : "scoreA" in m.scoreState
                  ? m.scoreState.scoreA
                  : "0";

              const scoreB =
                "runsB" in m.scoreState
                  ? `${m.scoreState.runsB}/${m.scoreState.wicketsB}`
                  : "goalsB" in m.scoreState
                  ? m.scoreState.goalsB
                  : "scoreB" in m.scoreState
                  ? m.scoreState.scoreB
                  : "0";

              return (
                <Link key={m.id} href={`/matches/${m.id}`}>
                  <Card variant="default" className="p-4 hover:border-hpl-accent hover:shadow-glow transition-all cursor-pointer bg-hpl-surface border-hpl-border group flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-hpl-border text-xs">
                      <span className="font-medium text-hpl-accent">{m.round}</span>
                      <Badge variant={m.status === "live" ? "live" : m.status === "completed" ? "completed" : "upcoming"} size="sm">
                        {m.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* 3-Column Aligned Header */}
                    <div className="py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <div className="flex items-center justify-end gap-2 min-w-0 text-right">
                        <span className="text-xs font-bold text-white truncate max-w-full font-display">
                          {tA?.name || m.teamAId}
                        </span>
                        <div
                          className="w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 border border-white/20"
                          style={{ backgroundColor: tA?.primaryColor || "#38b6ff" }}
                        >
                          {codeA}
                        </div>
                      </div>

                      <div className="min-w-[80px] text-center font-mono font-black text-sm text-white px-1 whitespace-nowrap tabular-nums">
                        {m.status === "upcoming" ? "vs" : `${scoreA} : ${scoreB}`}
                      </div>

                      <div className="flex items-center justify-start gap-2 min-w-0 text-left">
                        <div
                          className="w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 border border-white/20"
                          style={{ backgroundColor: isBye ? "#475569" : tB?.primaryColor || "#10b981" }}
                        >
                          {codeB}
                        </div>
                        <span className={`text-xs font-bold truncate max-w-full font-display ${isBye ? "text-hpl-gold italic" : "text-white"}`}>
                          {isBye ? "Scheduled Bye" : tB?.name || m.teamBId}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-hpl-border flex items-center justify-between text-[11px] text-hpl-muted">
                      <span>{formatDateTime(m.startTime)}</span>
                      <span className="text-hpl-accent font-semibold flex items-center group-hover:text-hpl-accent-soft">
                        Match Centre <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
