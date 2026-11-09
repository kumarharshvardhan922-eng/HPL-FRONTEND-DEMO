"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMatches, useSports, useTeams } from "../../hooks";
import { SportId } from "../../types";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { formatTimeOnly, getInitials } from "../../utils/formatters";

export const FixturesPage: React.FC = () => {
  const { sports } = useSports();
  const { teams } = useTeams();
  const [selectedSport, setSelectedSport] = useState<SportId | "all">("all");
  const { matches, isLoading } = useMatches(
    selectedSport !== "all" ? { sportId: selectedSport } : undefined
  );

  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  // Group matches by date string (YYYY-MM-DD)
  const groupedMatches = matches.reduce<Record<string, typeof matches>>((acc, match) => {
    const dateKey = match.startTime.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Championship Fixtures & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-hpl-muted mt-1">
            Official chronological match calendar across all sporting venues (7 Houses format)
          </p>
        </div>

        {/* Sport filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-hpl-surface-2 rounded-2xl border border-hpl-border">
          <button
            onClick={() => setSelectedSport("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all select-none ${
              selectedSport === "all"
                ? "bg-hpl-accent text-hpl-deep shadow-glow"
                : "text-hpl-muted hover:text-white hover:bg-hpl-surface"
            }`}
          >
            All Sports
          </button>
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

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : sortedDates.length === 0 ? (
        <EmptyState title="No fixtures found" description="No scheduled matches for the selected criteria." />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchesOnDate.map((m) => {
                    const tA = teamsMap[m.teamAId];
                    const isBye = m.teamBId === "bye";
                    const tB = isBye ? null : teamsMap[m.teamBId];

                    return (
                      <Link key={m.id} href={`/matches/${m.id}`}>
                        <Card
                          variant="default"
                          className="p-4 hover:border-hpl-accent hover:shadow-glow transition-all cursor-pointer flex flex-col justify-between bg-hpl-surface border-hpl-border group"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-hpl-border text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-hpl-accent uppercase text-[10px] bg-hpl-surface-2 px-2 py-0.5 rounded border border-hpl-border">
                                {m.sportId}
                              </span>
                              <span className="text-hpl-muted font-medium">{m.round}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {m.isDemo && <Badge variant="warning" size="sm">Demo Data</Badge>}
                              <Badge
                                variant={
                                  m.status === "live"
                                    ? "live"
                                    : m.status === "completed"
                                    ? "completed"
                                    : "upcoming"
                                }
                                size="sm"
                              >
                                {m.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="py-3 flex items-center justify-between gap-4">
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className="w-6 h-6 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: tA?.primaryColor || "#38b6ff" }}
                                >
                                  {tA?.shortName || getInitials(tA?.name || m.teamAId)}
                                </div>
                                <span className="text-sm font-bold text-white truncate font-display">
                                  {tA?.name || m.teamAId}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className="w-6 h-6 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: isBye ? "#475569" : tB?.primaryColor || "#10b981" }}
                                >
                                  {isBye ? "BYE" : tB?.shortName || getInitials(tB?.name || m.teamBId)}
                                </div>
                                <span className={`text-sm font-bold truncate font-display ${isBye ? "text-hpl-gold italic" : "text-white"}`}>
                                  {isBye ? "Scheduled Bye (Rest)" : tB?.name || m.teamBId}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-hpl-accent font-bold text-sm block">
                                {formatTimeOnly(m.startTime)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-hpl-border flex items-center justify-between text-[11px] text-hpl-muted">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-hpl-accent shrink-0" />
                              <span className="truncate">{m.venue}</span>
                            </span>
                            <span className="text-hpl-accent font-semibold flex items-center shrink-0 group-hover:text-hpl-accent-soft">
                              Scorecard <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
