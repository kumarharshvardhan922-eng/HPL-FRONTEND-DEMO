"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthView } from "../../providers/auth-view-provider";
import { Role, SportId } from "../../types";
import { HPL_SPORTS } from "../../config/sports";
import {
  Shield,
  ChevronDown,
  Check,
  Trophy,
  Activity,
  Zap,
  Target,
  Flame,
  Dribbble,
  Globe,
} from "lucide-react";

const SPORT_ICON_MAP: Record<SportId, React.ComponentType<{ className?: string }>> = {
  cricket: Trophy,
  football: Activity,
  kabaddi: Zap,
  badminton: Target,
  volleyball: Flame,
  basketball: Dribbble,
};

interface SwitcherOption {
  id: string;
  role: Role;
  sports?: SportId[];
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const RoleSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { role, assignedSportIds, switchRole } = useAuthView();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Dev-only rendering check
  const isDev =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ROLE_SWITCHER === "1";

  // Build the 8 ordered options (Super Admin, 6 Sport Admins, Public User)
  const options = useMemo<SwitcherOption[]>(
    () => [
      {
        id: "super_admin",
        role: "super_admin",
        title: "Super Admin",
        subtitle: "Full control of sports, houses, players and matches",
        icon: Shield,
      },
      ...HPL_SPORTS.map((s) => ({
        id: `sport_admin_${s.id}`,
        role: "sport_admin" as Role,
        sports: [s.id],
        title: `Sport Admin (${s.name} only)`,
        subtitle: `Restricted to ${s.name.toLowerCase()} scoring & matches`,
        icon: SPORT_ICON_MAP[s.id] || Trophy,
      })),
      {
        id: "public",
        role: "public",
        title: "Public User",
        subtitle: "View live scores, fixtures and stats (read-only)",
        icon: Globe,
      },
    ],
    []
  );

  const isOptionSelected = useCallback(
    (opt: SwitcherOption) => {
      if (opt.role !== role) return false;
      if (opt.role === "sport_admin") {
        const targetSport = opt.sports?.[0];
        return targetSport ? assignedSportIds.includes(targetSport) : false;
      }
      return true;
    },
    [role, assignedSportIds]
  );

  const handleSelect = async (opt: SwitcherOption) => {
    setIsOpen(false);
    await switchRole(opt.role, opt.sports);

    // Dynamic redirect guard if current path is no longer permitted
    if (opt.role === "public" && pathname.startsWith("/admin")) {
      router.push("/");
    } else if (opt.role === "sport_admin") {
      if (
        pathname.startsWith("/admin/admins") ||
        pathname.startsWith("/admin/settings") ||
        pathname.startsWith("/admin/sports")
      ) {
        router.push("/admin");
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < options.length) {
        handleSelect(options[focusedIndex]);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex(isOptionSelected);
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, isOptionSelected, options]);

  if (!isDev) {
    return null;
  }

  // Label for trigger button
  const currentSport =
    role === "sport_admin"
      ? HPL_SPORTS.find((s) => assignedSportIds.includes(s.id))?.name || assignedSportIds[0]
      : null;
  const buttonLabel =
    role === "super_admin"
      ? "Super Admin"
      : role === "sport_admin"
      ? `Sport Admin · ${currentSport || "Scoped"}`
      : "Public User";

  return (
    <div className="relative inline-block text-left" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-hpl-surface-2 hover:bg-hpl-border text-white border border-hpl-border transition-all shadow-sm focus:outline-hidden focus:ring-2 focus:ring-hpl-accent"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Switch active test role"
      >
        <Shield className="w-3.5 h-3.5 text-hpl-accent shrink-0" />
        <span className="truncate max-w-[150px]">{buttonLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-hpl-muted shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            ref={listRef}
            role="listbox"
            aria-label="Select role or assigned sport"
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-hpl-surface shadow-2xl border border-hpl-border p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto"
          >
            <div className="px-3 py-2 border-b border-hpl-border sticky top-0 bg-hpl-surface z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-hpl-accent font-display">
                Dev Role Switcher
              </span>
              <p className="text-[10px] text-hpl-muted">
                Test 6 sport-specific dashboards and platform permissions
              </p>
            </div>

            <div className="py-1 space-y-1">
              {options.map((opt, idx) => {
                const selected = isOptionSelected(opt);
                const isFocused = focusedIndex === idx;
                const IconComp = opt.icon;

                return (
                  <button
                    key={opt.id}
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`w-full flex items-start justify-between gap-3 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors focus:outline-hidden ${
                      selected
                        ? "bg-hpl-surface-2 text-hpl-accent font-bold border border-hpl-accent/40"
                        : isFocused
                        ? "bg-hpl-surface-2/70 text-white"
                        : "text-hpl-muted hover:bg-hpl-surface-2 hover:text-white"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                          selected
                            ? "bg-hpl-accent text-hpl-deep border-hpl-accent"
                            : "bg-hpl-surface-2 text-hpl-accent border-hpl-border"
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white tracking-tight">{opt.title}</div>
                        <div className="text-[10px] text-hpl-muted leading-tight mt-0.5 truncate">
                          {opt.subtitle}
                        </div>
                      </div>
                    </div>

                    {selected && (
                      <Check className="w-4 h-4 text-hpl-accent shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
