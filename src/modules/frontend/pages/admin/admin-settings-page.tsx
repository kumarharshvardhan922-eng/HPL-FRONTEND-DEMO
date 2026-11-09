"use client";

import React from "react";
import { useAuthView } from "../../providers/auth-view-provider";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { ShieldAlert, Settings } from "lucide-react";

export const AdminSettingsPage: React.FC = () => {
  const { role } = useAuthView();

  if (role !== "super_admin") {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-hpl-surface-2 text-hpl-gold flex items-center justify-center mx-auto border border-hpl-gold/30">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">Restricted to Super Admin</h2>
        <p className="text-xs text-hpl-muted">
          Tournament engine parameters and platform configurations are managed strictly by tournament conveners.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">System Settings</h1>
        <p className="text-xs text-hpl-muted mt-0.5">Global tournament rules, live scoring modes, and system defaults</p>
      </div>

      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
            <Settings className="w-4 h-4 text-hpl-accent" />
            <span>Tournament Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-3.5 bg-hpl-surface-2 rounded-xl border border-hpl-border">
            <div>
              <div className="font-bold text-white">Championship Format</div>
              <div className="text-xs text-hpl-muted">Official season designation & structure</div>
            </div>
            <span className="font-mono font-bold text-hpl-accent">HPL 2026 • 7 Houses</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-hpl-surface-2 rounded-xl border border-hpl-border">
            <div>
              <div className="font-bold text-white">Strict Public Read-Only Enforcement</div>
              <div className="text-xs text-hpl-muted">No public registration allowed; Google Sign-in for authorized staff only</div>
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-hpl-surface-2 rounded-xl border border-hpl-border">
            <div>
              <div className="font-bold text-white">Atomic Scoring Update Engine</div>
              <div className="text-xs text-hpl-muted">Prevents concurrent collision during live scoring events</div>
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Active
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
