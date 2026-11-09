"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Player, SportId } from "../../types";
import { useServices } from "../../providers";
import { useTeams, useSports, useToast } from "../../hooks";
import { useAuthView } from "../../providers/auth-view-provider";
import { canAccessSport } from "../../utils/permissions";
import { HPL_SPORTS } from "../../config/sports";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { SearchBar } from "../../components/ui/search-bar";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { PlayerForm } from "../../components/forms/player-form";
import { Pagination } from "../../components/ui/pagination";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ToastContainer } from "../../components/ui/toast";
import { getInitials } from "../../utils/formatters";

export const AdminPlayersPage: React.FC = () => {
  const { players: playersService } = useServices();
  const { teams } = useTeams();
  const { sports } = useSports();
  const { toasts, addToast, removeToast } = useToast();
  const { currentUser, role, assignedSportIds } = useAuthView();

  const isSportAdmin = role === "sport_admin";
  const assignedSport = isSportAdmin && assignedSportIds[0] ? HPL_SPORTS.find((s) => s.id === assignedSportIds[0]) : null;

  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSport, setSelectedSport] = useState(isSportAdmin && assignedSportIds[0] ? assignedSportIds[0] : "");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    if (isSportAdmin && assignedSportIds[0]) setSelectedSport(assignedSportIds[0]);
  }, [isSportAdmin, assignedSportIds]);

  const effectiveSportId = isSportAdmin && assignedSportIds[0] ? (assignedSportIds[0] as SportId) : (selectedSport as SportId) || undefined;

  const fetchPlayers = useCallback(async () => {
    const list = await playersService.getPlayers({ teamId: selectedTeam || undefined, sportId: effectiveSportId, search: search || undefined });
    setPlayers(list);
  }, [playersService, selectedTeam, effectiveSportId, search]);

  useEffect(() => { fetchPlayers(); }, [fetchPlayers]);

  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const visiblePlayers = isSportAdmin ? players.filter((p) => canAccessSport(currentUser, p.sportId)) : players;
  const totalPages = Math.ceil(visiblePlayers.length / pageSize) || 1;
  const paginatedPlayers = visiblePlayers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectPlayer = (id: string) => {
    const next = new Set(selectedPlayerIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedPlayerIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedPlayerIds.size === paginatedPlayers.length) setSelectedPlayerIds(new Set());
    else setSelectedPlayerIds(new Set(paginatedPlayers.map((p) => p.id)));
  };

  const handleSavePlayer = async (data: Omit<Player, "id">) => {
    setIsSubmitting(true);
    try {
      if (editingPlayer) {
        await playersService.updatePlayer(editingPlayer.id, data);
        addToast({ type: "success", title: "Athlete Updated", message: `${data.name} was updated successfully.` });
      } else {
        await playersService.createPlayer(data);
        addToast({ type: "success", title: "Athlete Registered", message: `${data.name} was registered.` });
      }
      setIsFormOpen(false);
      fetchPlayers();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "Failed to save athlete." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlayer = async () => {
    if (!deletingPlayer) return;
    try {
      await playersService.deletePlayer(deletingPlayer.id);
      addToast({ type: "success", title: "Athlete Removed", message: `${deletingPlayer.name} was removed from the roster.` });
      setDeletingPlayer(null);
      fetchPlayers();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "Failed to remove athlete." });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">Athletes & Rosters</h1>
          <p className="text-xs text-hpl-muted mt-0.5">Manage player eligibility, jersey numbers, and discipline assignments</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setEditingPlayer(null); setIsFormOpen(true); }} className="shadow-glow">
          <Plus className="w-4 h-4 mr-1.5" />Register Athlete
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search athlete by name..." />
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="px-3 py-2 rounded-xl border border-hpl-border text-xs text-white bg-hpl-surface-2 focus:outline-hidden focus:border-hpl-accent">
            <option value="" className="bg-hpl-surface text-white">All Houses</option>
            {teams.map((t) => (<option key={t.id} value={t.id} className="bg-hpl-surface text-white">{t.name}</option>))}
          </select>
          {isSportAdmin ? (
            <span className="px-3 py-2 rounded-xl border border-hpl-border text-xs text-hpl-accent bg-hpl-surface-2 font-semibold">
              {assignedSport?.name || "Assigned Sport"} (Scoped)
            </span>
          ) : (
            <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="px-3 py-2 rounded-xl border border-hpl-border text-xs text-white bg-hpl-surface-2 focus:outline-hidden focus:border-hpl-accent">
              <option value="" className="bg-hpl-surface text-white">All Sports</option>
              {sports.map((s) => (<option key={s.id} value={s.id} className="bg-hpl-surface text-white">{s.name}</option>))}
            </select>
          )}
          {selectedPlayerIds.size > 0 && (
            <span className="text-xs font-bold text-hpl-accent px-2 py-1 rounded bg-hpl-surface-2 border border-hpl-accent/30 font-mono">
              {selectedPlayerIds.size} Selected
            </span>
          )}
        </div>
      </div>

      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 text-hpl-accent">
                  <input type="checkbox" checked={selectedPlayerIds.size === paginatedPlayers.length && paginatedPlayers.length > 0} onChange={toggleSelectAll} className="rounded border-hpl-border bg-hpl-surface-2 text-hpl-accent" />
                </TableHead>
                <TableHead className="w-16 text-hpl-accent">#</TableHead>
                <TableHead className="text-hpl-accent">Athlete</TableHead>
                <TableHead className="text-hpl-accent">House</TableHead>
                <TableHead className="text-hpl-accent">Sport</TableHead>
                <TableHead className="text-hpl-accent">Position / Role</TableHead>
                <TableHead className="text-right text-hpl-accent">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiblePlayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-hpl-muted text-xs">
                    {isSportAdmin && assignedSport ? `No ${assignedSport.name.toLowerCase()} athletes registered yet.` : "No athletes found matching criteria."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPlayers.map((p) => {
                  const team = teamsMap[p.teamId];
                  const isSelected = selectedPlayerIds.has(p.id);
                  const canEdit = canAccessSport(currentUser, p.sportId);
                  return (
                    <TableRow key={p.id} className={isSelected ? "bg-hpl-surface-2/80" : ""}>
                      <TableCell>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelectPlayer(p.id)} className="rounded border-hpl-border bg-hpl-surface-2 text-hpl-accent" />
                      </TableCell>
                      <TableCell className="font-mono font-bold text-hpl-gold">#{p.jerseyNumber}</TableCell>
                      <TableCell className="font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-hpl-surface-2 text-hpl-accent border border-hpl-border flex items-center justify-center font-bold text-[10px] shrink-0">
                            {getInitials(p.name)}
                          </div>
                          <span>{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white text-xs font-medium font-display">{team?.name || p.teamId}</TableCell>
                      <TableCell className="capitalize text-hpl-accent-soft text-xs">{p.sportId}</TableCell>
                      <TableCell className="text-hpl-muted text-xs">{p.role}</TableCell>
                      <TableCell className="text-right">
                        {canEdit && (
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingPlayer(p); setIsFormOpen(true); }} className="text-hpl-accent hover:text-white">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingPlayer(p)} className="text-hpl-live hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-hpl-border">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingPlayer ? "Edit Athlete Profile" : "Register New Athlete"}>
        <PlayerForm initialData={editingPlayer || undefined} teams={teams} onSubmit={handleSavePlayer} onCancel={() => setIsFormOpen(false)} isLoading={isSubmitting} />
      </Modal>

      <ConfirmDialog isOpen={!!deletingPlayer} title="Delete Athlete" message={`Are you sure you want to remove ${deletingPlayer?.name} from the roster?`} confirmLabel="Delete Athlete" onConfirm={handleDeletePlayer} onCancel={() => setDeletingPlayer(null)} />
    </div>
  );
};
