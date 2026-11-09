"use client";

import React from "react";
import Link from "next/link";
import { useSports } from "../../hooks";
import { useAuthView } from "../../providers/auth-view-provider";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";

export const AdminSportsPage: React.FC = () => {
  const { sports } = useSports();
  const { role, assignedSportIds } = useAuthView();

  const filteredSports =
    role === "super_admin" ? sports : sports.filter((s) => assignedSportIds.includes(s.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            Sports Disciplines
          </h1>
          <p className="text-xs text-hpl-muted mt-0.5">
            Configured sports rules, scoring formats, and match allocations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSports.map((s) => (
          <Card key={s.id} variant="default" className="flex flex-col justify-between bg-hpl-surface border-hpl-border">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-hpl-surface-2 text-hpl-accent flex items-center justify-center border border-hpl-border">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-hpl-surface-2 text-hpl-accent border border-hpl-border font-mono">
                  {s.id}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-white font-display">{s.name}</CardTitle>
              <p className="text-xs text-hpl-muted mt-1">{s.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-hpl-surface-2 rounded-xl border border-hpl-border text-xs text-white">
                <span className="font-bold block text-[10px] uppercase text-hpl-accent font-display">Scoring Rules</span>
                <p className="mt-0.5 text-hpl-muted">{s.rulesSummary}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Link href={`/sports/${s.id}`}>
                  <Button variant="outline" size="sm" className="text-hpl-accent hover:text-white">
                    View Matches <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
