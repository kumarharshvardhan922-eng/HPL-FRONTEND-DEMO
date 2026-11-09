"use client";

import React, { useState } from "react";
import { useTeams, useToast } from "../../hooks";
import { Team } from "../../types";
import { useServices } from "../../providers";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { SearchBar } from "../../components/ui/search-bar";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { TeamForm } from "../../components/forms/team-form";
import { Pagination } from "../../components/ui/pagination";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ToastContainer } from "../../components/ui/toast";

export const AdminTeamsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const { teams, refetch } = useTeams(search);
  const { teams: teamsService } = useServices();
  const { toasts, addToast, removeToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const totalPages = Math.ceil(teams.length / pageSize) || 1;
  const paginatedTeams = teams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenCreate = () => {
    setEditingTeam(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (team: Team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleSaveTeam = async (data: Omit<Team, "id">) => {
    setIsSubmitting(true);
    try {
      if (editingTeam) {
        await teamsService.updateTeam(editingTeam.id, data);
        addToast({ type: "success", title: "House Updated", message: `${data.name} was updated successfully.` });
      } else {
        await teamsService.createTeam(data);
        addToast({ type: "success", title: "House Created", message: `${data.name} was added to the championship.` });
      }
      setIsFormOpen(false);
      refetch();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "Failed to save house." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!deletingTeam) return;
    setIsSubmitting(true);
    try {
      await teamsService.deleteTeam(deletingTeam.id);
      addToast({ type: "success", title: "House Deleted", message: `${deletingTeam.name} has been removed.` });
      setDeletingTeam(null);
      refetch();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "Failed to delete house." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            Championship Houses
          </h1>
          <p className="text-xs text-hpl-muted mt-0.5">Manage competing houses, color branding, and blocks</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search houses..." />
          <Button variant="primary" size="sm" onClick={handleOpenCreate} className="shadow-glow">
            <Plus className="w-4 h-4 mr-1.5" />
            Add House
          </Button>
        </div>
      </div>

      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14 text-hpl-accent">Badge</TableHead>
                <TableHead className="text-hpl-accent">House Name</TableHead>
                <TableHead className="text-hpl-accent">Code</TableHead>
                <TableHead className="text-hpl-accent">Block</TableHead>
                <TableHead className="text-right text-hpl-accent">Roster</TableHead>
                <TableHead className="text-right text-hpl-accent">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeams.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm border border-white/20"
                      style={{ backgroundColor: t.primaryColor || "#38b6ff" }}
                    >
                      {t.shortName}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-white font-display text-base">
                    {t.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-hpl-accent">
                    {t.shortName}
                  </TableCell>
                  <TableCell className="text-hpl-muted text-xs">{t.hostelBlock}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-hpl-gold">
                    {t.playerIds.length} Athletes
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(t)}
                        aria-label={`Edit ${t.name}`}
                        className="text-hpl-accent hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingTeam(t)}
                        aria-label={`Delete ${t.name}`}
                        className="text-hpl-live hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTeam ? "Edit House" : "Add New House"}
        description="Configure house identity, residential block, and brand colors."
      >
        <TeamForm
          initialData={editingTeam || undefined}
          onSubmit={handleSaveTeam}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTeam}
        title="Delete House"
        message={`Are you sure you want to delete ${deletingTeam?.name}? This action cannot be undone.`}
        confirmLabel="Delete House"
        onConfirm={handleDeleteTeam}
        onCancel={() => setDeletingTeam(null)}
        isLoading={isSubmitting}
      />
    </div>
  );
};
