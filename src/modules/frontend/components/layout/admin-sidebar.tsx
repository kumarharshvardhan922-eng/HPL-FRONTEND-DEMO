"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Users2,
  UserCheck,
  CalendarDays,
  ShieldAlert,
  Settings,
  ArrowLeft,
  X,
} from "lucide-react";
import { useAuthView } from "../../providers/auth-view-provider";
import { HPL_SPORTS } from "../../config/sports";

export interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { role, assignedSportIds } = useAuthView();

  const isSuperAdmin = role === "super_admin";

  const assignedSport =
    role === "sport_admin" && assignedSportIds[0]
      ? HPL_SPORTS.find((s) => s.id === assignedSportIds[0])
      : null;

  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard, allowSportAdmin: true },
    { name: "Fixtures & Matches", href: "/admin/fixtures", icon: CalendarDays, allowSportAdmin: true },
    { name: "Houses", href: "/admin/teams", icon: Users2, allowSportAdmin: true },
    { name: "Players", href: "/admin/players", icon: UserCheck, allowSportAdmin: true },
    { name: "Sports", href: "/admin/sports", icon: Trophy, allowSportAdmin: false },
    { name: "Admins & Roles", href: "/admin/admins", icon: ShieldAlert, allowSportAdmin: false },
    { name: "Settings", href: "/admin/settings", icon: Settings, allowSportAdmin: false },
  ];

  // Hide Sports, Admins and Settings for Sport Admin
  const visibleNavigation = navigation.filter((item) => isSuperAdmin || item.allowSportAdmin);

  return (
    <aside className="w-64 bg-hpl-surface text-white flex flex-col h-full border-r border-hpl-border">
      <div className="p-4 sm:p-5 border-b border-hpl-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-hpl-accent/60 shadow-glow bg-white">
            <Image
              src="/hpl-logo.png"
              alt="Hostel Premier League logo"
              width={36}
              height={36}
              priority
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white leading-tight font-display">
              HPL Admin
            </div>
            <div className="text-[10px] text-hpl-accent font-medium">Tournament Control</div>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="md:hidden p-1 rounded-lg text-hpl-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role tag banner */}
      <div className="px-5 py-3 bg-hpl-surface-2 border-b border-hpl-border">
        <div className="text-[10px] uppercase font-bold text-hpl-accent tracking-wider">Active Mode</div>
        <div className="text-xs font-semibold text-white capitalize mt-0.5">
          {role === "sport_admin"
            ? `Sport Admin (${assignedSport?.name || assignedSportIds[0] || "Scoped"})`
            : role.replace("_", " ")}
          {role === "sport_admin" && (
            <span className="text-[10px] block text-hpl-muted font-normal mt-0.5">
              Assigned: {assignedSport?.name || assignedSportIds.join(", ")}
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visibleNavigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-hpl-accent text-hpl-deep font-bold shadow-sm"
                  : "text-hpl-muted hover:bg-hpl-surface-2 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-hpl-border">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-hpl-muted hover:text-white hover:bg-hpl-surface-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
};
