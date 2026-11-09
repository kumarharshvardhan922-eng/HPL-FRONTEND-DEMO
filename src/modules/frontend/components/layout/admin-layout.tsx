"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { SiteBackground } from "./site-background";
import { useAuthView } from "../../providers/auth-view-provider";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { role, switchRole } = useAuthView();

  if (role === "public") {
    return (
      <div className="min-h-screen bg-hpl-deep flex items-center justify-center p-4 relative">
        <SiteBackground variant="admin" />
        <div className="max-w-md w-full bg-hpl-surface rounded-2xl p-8 border border-hpl-border shadow-card text-center flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-hpl-surface-2 text-hpl-gold flex items-center justify-center mb-4 border border-hpl-gold/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">Restricted Administration Area</h2>
          <p className="text-sm text-hpl-muted mt-2 mb-6">
            You are currently viewing as <span className="font-semibold text-white">Public User (Read-Only)</span>.
            Admin operations require Super Admin or Sport Admin privileges.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Button
              variant="primary"
              onClick={() => switchRole("super_admin")}
              className="w-full shadow-glow"
            >
              Switch to Super Admin (Dev Mode)
            </Button>
            <Button
              variant="secondary"
              onClick={() => switchRole("sport_admin", ["cricket"])}
              className="w-full bg-hpl-surface-2 hover:bg-hpl-border text-hpl-accent"
            >
              Switch to Sport Admin (Cricket)
            </Button>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full border-hpl-border text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Public Website
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-transparent text-white relative">
      <SiteBackground variant="admin" />

      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile drawer sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/70 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative z-10 w-64 h-full shadow-2xl">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main admin content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminTopbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} title={title} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};
