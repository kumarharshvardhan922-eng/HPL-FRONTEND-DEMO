"use client";

import React from "react";
import { RoleSwitcher } from "./role-switcher";
import { Menu, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAuthView } from "../../providers/auth-view-provider";
import { HPL_SPORTS } from "../../config/sports";

export interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
  title?: string;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onOpenMobileSidebar, title }) => {
  const { role, assignedSportIds } = useAuthView();

  const assignedSport =
    role === "sport_admin" && assignedSportIds[0]
      ? HPL_SPORTS.find((s) => s.id === assignedSportIds[0])
      : null;

  const badgeText =
    role === "super_admin"
      ? "Super Admin"
      : role === "sport_admin"
      ? `Sport Admin · ${assignedSport?.name || assignedSportIds[0] || "Scoped"}`
      : "Public User";

  return (
    <header className="h-16 bg-hpl-surface border-b border-hpl-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-card">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation sidebar"
          className="md:hidden p-2 rounded-xl text-hpl-muted hover:text-white hover:bg-hpl-surface-2"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
            {title || "Admin Operations"}
          </h1>
          <p className="text-[11px] text-hpl-muted hidden sm:block">
            Centralized Tournament & Scoring Command
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <Badge
            variant={role === "super_admin" ? "completed" : "upcoming"}
            size="sm"
            className="font-medium"
          >
            <ShieldCheck className="w-3 h-3 text-hpl-accent mr-1" />
            <span>{badgeText}</span>
          </Badge>
        </div>
        <RoleSwitcher />
      </div>
    </header>
  );
};
