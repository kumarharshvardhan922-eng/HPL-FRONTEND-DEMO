"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMatches, useTeams, useToast } from "../../hooks";
import { Match, MatchStatus, SportId } from "../../types";
import { useServices } from "../../providers";
import { useAuthView } from "../../providers/auth-view-provider";
import { canAccessSport } from "../../utils/permissions";
import { HPL_SPORTS } from "../../config/sports";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { MatchForm } from "../../components/forms/match-form";
import { ManualOverrideModal } from "../../components/scoreboards/manual-override-modal";
import { ToastContainer } from "../../components/ui/toast";
import { Plus, Calendar, List, Edit3, SlidersHorizontal } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";

export const AdminFixturesPage: React.FC = () => {
  const { matches, refetch } = useMatches();
  const { teams } = useTeams();
  const { matches: matchesService, scoring } = useServices();
  const { toasts, addToast, removeToast } = useToast();
  const { currentUser, role, assignedSportIds, isPermittedForSport } = useAuthView();

  const assignedSport = role === "sport_admin" && assignedSportIds[0] ? HPL_SPORTS.find((s) => s.id === assignedSportIds[0]) : null;
  const visibleMatches = role === "super_admin" ? matches : matches.filter((m) => canAccessSport(currentUser, m.sportId));

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [overrideMatch, setOverrideMatch] = useState<Match | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  const handleCreateMatch = async (data: {
    sportId: SportId; teamAId: string; teamBId: string; startTime: string; venue: string; round: string; refereeUmpire: string;
  }) => {
    if (!canAccessSport(currentUser, data.sportId)) {
      addToast({ type: "error", title: "Access Denied", message: "Unauthorized for this sport." });
      return;
    }
    setIsSubmitting(true);
    try {
      await matchesService.createMatch(data);
      addToast({ type: "success", title: "Fixture Scheduled", message: "New match added to calendar." });
      setIsCreateOpen(false);
      refetch();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "Failed to create match." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (matchId: string, nextStatus: MatchStatus) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch || !canAccessSport(currentUser, targetMatch.sportId)) {
      addToast({ type: "error", title: "Access Denied", message: "Unauthorized to modify status for this sport." });
      return;
    }
    try {
      await matchesService.updateMatchStatus(matchId, nextStatus);
      addToast({ type: "success", title: "Status Updated", message: `Match status transitioned to ${nextStatus}.` });
      refetch();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "Failed to update status." });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">Fixtures & Scheduling</h1>
          <p className="text-xs text-hpl-muted mt-0.5">Control match calendar, launch live scoring, and manage states</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-hpl-surface-2 p-1 rounded-xl border border-hpl-border">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-hpl-accent text-hpl-deep shadow-xs" : "text-hpl-muted hover:text-white"}`}
              aria-label="List view"
            ><List className="w-4 h-4" /></button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "calendar" ? "bg-hpl-accent text-hpl-deep shadow-xs" : "text-hpl-muted hover:text-white"}`}
              aria-label="Calendar view"
            ><Calendar className="w-4 h-4" /></button>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="shadow-glow">
            <Plus className="w-4 h-4 mr-1.5" />Schedule Match
          </Button>
        </div>
      </div>

      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-hpl-accent">Sport</TableHead>
                <TableHead className="text-hpl-accent">Competing Houses</TableHead>
                <TableHead className="text-hpl-accent">Date & Time</TableHead>
                <TableHead className="text-hpl-accent">Venue & Round</TableHead>
                <TableHead className="text-hpl-accent">Status</TableHead>
                <TableHead className="text-right text-hpl-accent">Scoring Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleMatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-hpl-muted text-xs">
                    {role === "sport_admin" && assignedSport ? `No ${assignedSport.name.toLowerCase()} matches yet. Create the first fixture.` : "No fixtures scheduled yet. Click \"Schedule Match\" to create the first fixture."}
                  </TableCell>
                </TableRow>
              ) : (
                visibleMatches.map((m) => {
                  const tA = teamsMap[m.teamAId];
                  const isBye = m.teamBId === "bye";
                  const tB = isBye ? null : teamsMap[m.teamBId];
                  const canScore = isPermittedForSport(m.sportId) && !isBye;
                  const canOverride = canAccessSport(currentUser, m.sportId) && !isBye;

                  return (
                    <TableRow key={m.id}>
                      <TableCell className="font-bold text-xs uppercase text-hpl-accent font-mono">{m.sportId}</TableCell>
                      <TableCell className="font-semibold text-white">
                        <div className="font-display tracking-wide">
                          {tA?.name || m.teamAId} <span className="text-hpl-muted font-normal font-sans">vs</span>{" "}
                          <span className={isBye ? "text-hpl-gold italic font-sans text-xs" : ""}>{isBye ? "Scheduled Bye" : tB?.name || m.teamBId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-hpl-muted">{formatDateTime(m.startTime)}</TableCell>
                      <TableCell className="text-xs text-hpl-muted">
                        <div className="text-white">{m.venue}</div>
                        <div className="text-[10px] text-hpl-accent font-medium">{m.round}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.status === "live" ? "live" : m.status === "completed" ? "completed" : "upcoming"} size="sm">{m.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canScore && (
                            <Link href={`/admin/scoring/${m.id}`}>
                              <Button variant="primary" size="sm" className="h-8 px-2.5 text-xs shadow-glow">
                                <Edit3 className="w-3.5 h-3.5 mr-1" />Console
                              </Button>
                            </Link>
                          )}
                          {!isBye && m.status === "upcoming" && (
                            <Button variant="secondary" size="sm" className="h-8 px-2 text-xs" onClick={() => handleStatusChange(m.id, "live")}>Go Live</Button>
                          )}
                          {!isBye && m.status === "live" && (
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => handleStatusChange(m.id, "completed")}>Finish</Button>
                          )}
                          {canOverride && (
                            <Button variant="ghost" size="sm" onClick={() => setOverrideMatch(m)} title="Manual Override" className="h-8 w-8 p-0 text-hpl-muted hover:text-white">
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Schedule New Match">
        <MatchForm teams={teams} onSubmit={handleCreateMatch} onCancel={() => setIsCreateOpen(false)} isLoading={isSubmitting} />
      </Modal>

      {overrideMatch && (
        <ManualOverrideModal
          isOpen={!!overrideMatch}
          onClose={() => setOverrideMatch(null)}
          sportName={overrideMatch.sportId.toUpperCase()}
          currentScoreA={"runsA" in overrideMatch.scoreState ? overrideMatch.scoreState.runsA : "goalsA" in overrideMatch.scoreState ? overrideMatch.scoreState.goalsA : "scoreA" in overrideMatch.scoreState ? overrideMatch.scoreState.scoreA : 0}
          currentScoreB={"runsB" in overrideMatch.scoreState ? overrideMatch.scoreState.runsB : "goalsB" in overrideMatch.scoreState ? overrideMatch.scoreState.goalsB : "scoreB" in overrideMatch.scoreState ? overrideMatch.scoreState.scoreB : 0}
          teamAName={teamsMap[overrideMatch.teamAId]?.name || "Team A"}
          teamBName={teamsMap[overrideMatch.teamBId]?.name || "Team B"}
          onApplyOverride={async (nA, nB, reason) => {
            const nextState = JSON.parse(JSON.stringify(overrideMatch.scoreState));
            if ("runsA" in nextState) { nextState.runsA = nA; nextState.runsB = nB; }
            else if ("goalsA" in nextState) { nextState.goalsA = nA; nextState.goalsB = nB; }
            else if ("scoreA" in nextState) { nextState.scoreA = nA; nextState.scoreB = nB; }
            await scoring.manualOverrideScore(overrideMatch.id, nextState, reason);
            await matchesService.updateMatch(overrideMatch.id, { scoreState: nextState });
            addToast({ type: "success", title: "Override Applied", message: "Score updated in audit log." });
            setOverrideMatch(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};
