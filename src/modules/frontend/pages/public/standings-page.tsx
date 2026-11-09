"use client";

import React, { useState } from "react";
import { useSports, useStandings } from "../../hooks";
import { SportId } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Trophy } from "lucide-react";

export const StandingsPage: React.FC = () => {
  const { sports } = useSports();
  const [activeSport, setActiveSport] = useState<SportId>("cricket");
  const { standings, isLoading } = useStandings(activeSport);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Championship Standings
          </h1>
          <p className="text-xs sm:text-sm text-hpl-muted mt-1">
            Authoritative house leaderboard tracking qualification status and tiebreakers
          </p>
        </div>

        {/* Sport switcher pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-hpl-surface-2 rounded-2xl border border-hpl-border">
          {sports.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSport(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all select-none ${
                activeSport === s.id
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
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-hpl-gold" />
                <span className="capitalize">{activeSport} Leaderboard</span>
                {standings.some((s) => s.isDemo) && (
                  <Badge variant="warning" size="sm">
                    Demo Data
                  </Badge>
                )}
              </div>
              <span className="text-xs font-normal text-hpl-muted">Top 4 qualify for semi-finals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-hpl-accent">Rank</TableHead>
                  <TableHead className="text-hpl-accent">House</TableHead>
                  <TableHead className="text-right text-hpl-accent">P</TableHead>
                  <TableHead className="text-right text-hpl-accent">W</TableHead>
                  <TableHead className="text-right text-hpl-accent">L</TableHead>
                  <TableHead className="text-right text-hpl-accent">D / T</TableHead>
                  {activeSport === "cricket" && <TableHead className="text-right text-hpl-accent">NRR</TableHead>}
                  {activeSport === "football" && <TableHead className="text-right text-hpl-accent">GD</TableHead>}
                  {activeSport !== "cricket" && activeSport !== "football" && (
                    <TableHead className="text-right text-hpl-accent">Diff</TableHead>
                  )}
                  <TableHead className="text-right font-black text-hpl-accent">PTS</TableHead>
                  <TableHead className="text-center text-hpl-accent">Form</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((s, idx) => {
                  return (
                    <TableRow key={s.teamId}>
                      <TableCell className="font-bold text-hpl-gold font-mono">
                        #{idx + 1}
                      </TableCell>
                      <TableCell className="font-bold text-white font-display tracking-wide text-base">
                        {s.teamName}
                      </TableCell>
                      <TableCell className="text-right font-mono text-hpl-muted">{s.played}</TableCell>
                      <TableCell className="text-right font-mono text-hpl-success font-bold">{s.won}</TableCell>
                      <TableCell className="text-right font-mono text-hpl-live">{s.lost}</TableCell>
                      <TableCell className="text-right font-mono text-hpl-muted">{s.tied}</TableCell>

                      {activeSport === "cricket" && (
                        <TableCell className="text-right font-mono text-xs text-hpl-accent-soft">
                          {s.netRunRate !== undefined && s.netRunRate > 0 ? `+${s.netRunRate}` : s.netRunRate}
                        </TableCell>
                      )}
                      {activeSport === "football" && (
                        <TableCell className="text-right font-mono text-xs text-hpl-accent-soft">
                          {s.goalDifference !== undefined && s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                        </TableCell>
                      )}
                      {activeSport !== "cricket" && activeSport !== "football" && (
                        <TableCell className="text-right font-mono text-xs text-hpl-accent-soft">
                          {s.scoreDifference !== undefined && s.scoreDifference > 0 ? `+${s.scoreDifference}` : s.scoreDifference}
                        </TableCell>
                      )}

                      <TableCell className="text-right font-mono font-black text-white text-base">
                        {s.points}
                      </TableCell>

                      {/* Form Chips */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {s.form.slice(-5).map((res, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                                res === "W"
                                  ? "bg-hpl-success text-hpl-deep"
                                  : res === "L"
                                  ? "bg-hpl-live text-white"
                                  : "bg-hpl-surface-2 text-hpl-muted border border-hpl-border"
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
