"use client";

import React, { useEffect, useState, useCallback } from "react";
import { User, Role, SportId } from "../../types";
import { useServices } from "../../providers";
import { useAuthView } from "../../providers/auth-view-provider";
import { useToast } from "../../hooks";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { AdminInviteForm } from "../../components/forms/admin-invite-form";
import { ShieldAlert, UserPlus, ShieldCheck } from "lucide-react";
import { ToastContainer } from "../../components/ui/toast";

export const AdminAdminsPage: React.FC = () => {
  const { authView } = useServices();
  const { role } = useAuthView();
  const { toasts, addToast, removeToast } = useToast();

  const [admins, setAdmins] = useState<User[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    try {
      const list = await authView.getAdmins();
      setAdmins(list);
    } catch {
      // Ignored
    }
  }, [authView]);

  useEffect(() => {
    if (role === "super_admin") {
      fetchAdmins();
    }
  }, [role, fetchAdmins]);

  // Role Guard: Only Super Admin can view/manage Admins
  if (role !== "super_admin") {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-hpl-surface-2 text-hpl-gold flex items-center justify-center mx-auto border border-hpl-gold/30">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">Restricted to Super Admin</h2>
        <p className="text-xs text-hpl-muted">
          Only tournament conveners (Super Admin) are authorized to view administrative operators,
          delegate sport roles, or issue invitations.
        </p>
      </div>
    );
  }

  const handleInvite = async (data: {
    email: string;
    displayName: string;
    role: Role;
    assignedSportIds: SportId[];
  }) => {
    setIsSubmitting(true);
    try {
      await authView.inviteAdmin(data);
      addToast({ type: "success", title: "Invitation Sent", message: `Invited ${data.displayName} as ${data.role}.` });
      setIsInviteOpen(false);
      fetchAdmins();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "Failed to invite admin." });
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
            Administrator Access & Delegation
          </h1>
          <p className="text-xs text-hpl-muted mt-0.5">
            Configure Google Sign-In roles, assign sport disciplines, and manage console operators
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsInviteOpen(true)} className="shadow-glow">
          <UserPlus className="w-4 h-4 mr-1.5" />
          Invite Operator
        </Button>
      </div>

      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-hpl-accent">Administrator</TableHead>
                <TableHead className="text-hpl-accent">Email Address</TableHead>
                <TableHead className="text-hpl-accent">Role</TableHead>
                <TableHead className="text-hpl-accent">Assigned Disciplines</TableHead>
                <TableHead className="text-right text-hpl-accent">Access Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-hpl-accent" />
                    <span>{u.displayName}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-hpl-muted">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "super_admin" ? "default" : "upcoming"} size="sm">
                      {u.role.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-hpl-accent-soft capitalize">
                    {u.role === "super_admin" ? (
                      <span className="font-semibold text-hpl-accent font-mono">All 6 Disciplines</span>
                    ) : u.assignedSportIds && u.assignedSportIds.length > 0 ? (
                      u.assignedSportIds.join(", ")
                    ) : (
                      <span className="text-hpl-muted">None assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Admin Operator">
        <AdminInviteForm
          onSubmit={handleInvite}
          onCancel={() => setIsInviteOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
