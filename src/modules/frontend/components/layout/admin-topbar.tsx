"use client";

import React from "react";
import { RoleSwitcher } from "./role-switcher";
import { Menu, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAuthView } from "../../providers/auth-view-provider";

export interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
  title?: string;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onOpenMobileSidebar, title }) => {
  const { role } = useAuthView();

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
          <Badge variant="upcoming" size="sm">
            <ShieldCheck className="w-3 h-3 text-hpl-accent mr-1" />
            <span className="capitalize">{role.replace("_", " ")}</span>
          </Badge>
        </div>
        <RoleSwitcher />
      </div>
    </header>
  );
};
