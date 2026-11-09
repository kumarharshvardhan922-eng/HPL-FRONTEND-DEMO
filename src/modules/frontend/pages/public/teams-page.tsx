"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeams } from "../../hooks";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { SearchBar } from "../../components/ui/search-bar";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Users2, ArrowRight } from "lucide-react";
import { getInitials } from "../../utils/formatters";

export const TeamsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const { teams, isLoading, error, refetch } = useTeams(search);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Championship Houses
          </h1>
          <p className="text-xs sm:text-sm text-hpl-muted mt-1">
            7 competing houses across all 6 league sporting disciplines
          </p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search house name, block..." />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : teams.length === 0 ? (
        <EmptyState title="No houses found" description="No house matches your search criteria." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map((t) => (
            <Link key={t.id} href={`/teams/${t.id}`}>
              <Card
                variant="default"
                className="hover:border-hpl-accent hover:shadow-glow transition-all duration-200 flex flex-col justify-between h-full group bg-hpl-surface border-hpl-border"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-white shadow-md transition-transform group-hover:scale-105 shrink-0 border border-white/20 select-none"
                      style={{ backgroundColor: t.primaryColor || "#38b6ff" }}
                    >
                      {t.shortName || getInitials(t.name)}
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-hpl-surface-2 text-hpl-accent border border-hpl-border">
                      {t.shortName}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold line-clamp-2 leading-tight text-white font-display">
                    {t.name}
                  </CardTitle>
                  <p className="text-xs text-hpl-muted mt-0.5">{t.hostelBlock}</p>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="p-3 bg-hpl-surface-2 rounded-xl border border-hpl-border flex items-center justify-between text-xs">
                    <span className="text-hpl-muted flex items-center gap-1.5">
                      <Users2 className="w-3.5 h-3.5 text-hpl-accent" />
                      Roster Size
                    </span>
                    <span className="font-bold text-white font-mono">
                      {t.playerIds.length > 0 ? `${t.playerIds.length} Athletes` : "0 (Unallocated)"}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-hpl-border flex items-center justify-between text-xs font-semibold text-hpl-accent">
                    <span>View Roster & Stats</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
