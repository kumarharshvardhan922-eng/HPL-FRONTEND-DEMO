"use client";

import React, { useState } from "react";
import { useMatches, useSports, useTeams } from "../../hooks";
import { SportId } from "../../types";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { Calendar } from "lucide-react";
import {
  SportChipRow,
  MatchRow,
} from "../../components/scoreboards";

export const FixturesPage: React.FC = () => {
  const { sports } = useSports();
  const { teams } = useTeams();
  const [selectedSport, setSelectedSport] = useState<SportId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "upcoming" | "completed">("all");

  const { matches, isLoading } = useMatches(
    selectedSport !== "all" ? { sportId: selectedSport } : undefined
  );

  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  // Filter by status if selected
  const filteredMatches = matches.filter((m) => {
    if (statusFilter === "all") return true;
    return m.status === statusFilter;
  });

  // Group matches by date string (YYYY-MM-DD)
  const groupedMatches = filteredMatches.reduce<Record<string, typeof matches>>((acc, match) => {
    const dateKey = match.startTime.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
          Championship Fixtures & Schedule
        </h1>
        <p className="text-xs sm:text-sm text-hpl-muted mt-1">
          Official chronological match calendar across all 7 hostel houses
        </p>
      </div>

      {/* Sport Chip Row */}
      <SportChipRow
        sports={sports}
        selectedSportId={selectedSport}
        onSelectSport={(id) => setSelectedSport(id as SportId | "all")}
        includeAll={true}
        allLabel="All Sports"
      />

      {/* Status Filters: All / Live / Upcoming / Completed */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: "all", label: "All Matches" },
          { id: "live", label: "Live" },
          { id: "upcoming", label: "Upcoming" },
          { id: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 select-none cursor-pointer ${
              statusFilter === tab.id
                ? "bg-hpl-surface-2 text-hpl-accent border border-hpl-accent font-bold"
                : "text-hpl-muted hover:text-white bg-transparent border border-hpl-border/60 hover:border-hpl-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : sortedDates.length === 0 ? (
        <EmptyState title="No fixtures found" description="No scheduled matches match the selected criteria." />
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateStr) => {
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const matchesOnDate = groupedMatches[dateStr];

            return (
              <div key={dateStr} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-hpl-accent">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                  <span className="text-[11px] font-normal text-hpl-muted">
                    ({matchesOnDate.length} {matchesOnDate.length === 1 ? "fixture" : "fixtures"})
                  </span>
                </div>

                <div className="space-y-2.5">
                  {matchesOnDate.map((m) => (
                    <MatchRow
                      key={m.id}
                      match={m}
                      teamA={teamsMap[m.teamAId]}
                      teamB={teamsMap[m.teamBId]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
