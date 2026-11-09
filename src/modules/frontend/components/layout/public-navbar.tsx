"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, Activity } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAuthView } from "../../providers/auth-view-provider";

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role } = useAuthView();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sports/cricket", label: "Sports" },
    { href: "/fixtures", label: "Fixtures" },
    { href: "/standings", label: "Leaderboard" },
    { href: "/teams", label: "Houses" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-hpl-deep/90 backdrop-blur-md border-b border-hpl-border text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo and Wordmark matching Image 1 & 3 */}
        <Link href="/" className="flex items-center gap-3 sm:gap-3.5 group">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-hpl-accent/60 shadow-glow bg-white">
            <Image
              src="/hpl-logo.png"
              alt="Hostel Premier League logo"
              width={56}
              height={56}
              priority
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col">
            <div className="font-display tracking-wider text-base sm:text-xl font-bold flex items-center gap-1.5 leading-none">
              <span className="text-white/60">HOSTEL</span>
              <span className="bg-gradient-to-r from-hpl-accent-soft to-hpl-accent bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(56,182,255,0.45)] font-black">
                PREMIER
              </span>
              <span className="text-white/60">LEAGUE</span>
            </div>
            <span className="text-[10px] text-hpl-muted font-medium tracking-widest uppercase mt-1">
              VIT • HPL 2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-hpl-surface-2 text-hpl-accent font-semibold border border-hpl-border shadow-inner"
                    : "text-hpl-muted hover:text-white hover:bg-hpl-surface/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action & Admin Portal Link */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/matches/match-cricket-live-1">
            <Badge variant="live" size="sm" className="cursor-pointer hover:opacity-90">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              LIVE MATCH
            </Badge>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-hpl-surface-2 hover:bg-hpl-border border border-hpl-border text-hpl-accent hover:text-white transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
            <span className="text-[10px] text-hpl-muted">({role})</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2 rounded-xl text-hpl-muted hover:text-white hover:bg-hpl-surface-2 border border-hpl-border/50"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-hpl-surface border-b border-hpl-border space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-hpl-muted hover:text-white hover:bg-hpl-surface-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-hpl-border flex flex-col gap-2">
            <Link
              href="/matches/match-cricket-live-1"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-hpl-surface-2 text-xs font-semibold text-white"
            >
              <span>Current Live Score</span>
              <Badge variant="live" size="sm">LIVE</Badge>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-hpl-accent text-hpl-deep font-bold text-xs text-center"
            >
              <Shield className="w-4 h-4" />
              <span>Open Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
