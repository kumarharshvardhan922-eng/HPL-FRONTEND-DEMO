"use client";

import React, { useState } from "react";
import { useAuthView } from "../../providers/auth-view-provider";
import { Role, SportId } from "../../types";
import { Shield, ChevronDown, Check } from "lucide-react";

export const RoleSwitcher: React.FC = () => {
  const { role, assignedSportIds, switchRole } = useAuthView();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectRole = async (newRole: Role, sports?: SportId[]) => {
    await switchRole(newRole, sports);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-hpl-surface-2 hover:bg-hpl-border text-white border border-hpl-border transition-all shadow-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Shield className="w-3.5 h-3.5 text-hpl-accent" />
        <span className="capitalize">{role.replace("_", " ")}</span>
        <ChevronDown className="w-3.5 h-3.5 text-hpl-muted" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-hpl-surface shadow-2xl border border-hpl-border p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-hpl-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-hpl-accent font-display">
                Dev Role Switcher
              </span>
              <p className="text-[10px] text-hpl-muted">Test platform permissions live</p>
            </div>

            <div className="py-1 space-y-1">
              <button
                onClick={() => handleSelectRole("super_admin")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                  role === "super_admin" ? "bg-hpl-surface-2 text-hpl-accent font-bold border border-hpl-accent/30" : "text-hpl-muted hover:bg-hpl-surface-2 hover:text-white"
                }`}
              >
                <div>
                  <div className="font-semibold text-white">Super Admin</div>
                  <div className="text-[10px] text-hpl-muted">Full control over all sports & settings</div>
                </div>
                {role === "super_admin" && <Check className="w-4 h-4 text-hpl-accent" />}
              </button>

              <button
                onClick={() => handleSelectRole("sport_admin", ["cricket"])}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                  role === "sport_admin" && assignedSportIds.includes("cricket")
                    ? "bg-hpl-surface-2 text-hpl-accent font-bold border border-hpl-accent/30"
                    : "text-hpl-muted hover:bg-hpl-surface-2 hover:text-white"
                }`}
              >
                <div>
                  <div className="font-semibold text-white">Sport Admin (Cricket only)</div>
                  <div className="text-[10px] text-hpl-muted">Restricted to cricket scoring & matches</div>
                </div>
                {role === "sport_admin" && assignedSportIds.includes("cricket") && (
                  <Check className="w-4 h-4 text-hpl-accent" />
                )}
              </button>

              <button
                onClick={() => handleSelectRole("public")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                  role === "public" ? "bg-hpl-surface-2 text-hpl-accent font-bold border border-hpl-accent/30" : "text-hpl-muted hover:bg-hpl-surface-2 hover:text-white"
                }`}
              >
                <div>
                  <div className="font-semibold text-white">Public (Read-Only)</div>
                  <div className="text-[10px] text-hpl-muted">View live scoreboards & standings</div>
                </div>
                {role === "public" && <Check className="w-4 h-4 text-hpl-accent" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
