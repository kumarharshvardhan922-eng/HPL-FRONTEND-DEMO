import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Activity, Calendar, Trophy, ChevronRight } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export const HomeHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-hpl-border/60 bg-transparent">
      {/* Subtle stadium light enhancement */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-hpl-accent/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-hpl-accent-soft/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-hpl-border/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 space-y-6">
        {/* Large Logo Centered Above Wordmark (Change 3) */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-hpl-accent/60 shadow-glow bg-white shrink-0 mb-2">
          <Image
            src="/hpl-logo.png"
            alt="Hostel Premier League logo"
            width={112}
            height={112}
            priority
            className="object-cover w-full h-full"
          />
        </div>

        {/* Hero Wordmark (Change 1 - Image 1 Look) */}
        <div className="flex flex-col items-center">
          <div className="font-display tracking-widest text-4xl sm:text-6xl md:text-7xl font-black uppercase flex flex-wrap items-center justify-center gap-2 sm:gap-4 leading-none">
            <span className="text-white/60">HOSTEL</span>
            <span className="bg-gradient-to-r from-hpl-accent-soft via-hpl-accent to-[#0091ff] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,182,255,0.6)]">
              PREMIER
            </span>
            <span className="text-white/60">LEAGUE</span>
          </div>
          <span className="text-xs sm:text-sm tracking-widest font-semibold uppercase text-hpl-accent mt-3">
            Inter-House Sports Championship • VIT 2026
          </span>
        </div>

        {/* Subtitle / Description */}
        <p className="max-w-2xl text-sm sm:text-base text-hpl-muted leading-relaxed">
          Official real-time tournament intelligence platform. Live overs and ball-by-ball cricket,
          football pitch lineups and stats, raid points for kabaddi, badminton, volleyball, and basketball
          across all 7 houses.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/matches/match-cricket-live-1">
            <Button variant="primary" size="lg" className="shadow-glow font-bold">
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              Live Match Centre
            </Button>
          </Link>
          <Link href="/fixtures">
            <Button variant="outline" size="lg" className="border-hpl-border bg-hpl-surface hover:bg-hpl-surface-2 text-white">
              <Calendar className="w-4 h-4 mr-2 text-hpl-accent" />
              Fixtures & Results
            </Button>
          </Link>
          <Link href="/standings">
            <Button variant="secondary" size="lg" className="bg-hpl-surface-2 hover:bg-hpl-border text-hpl-gold border border-hpl-gold/30">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
          </Link>
        </div>

        {/* Live Now Quick Card Preview with Real Houses */}
        <div className="w-full max-w-md mt-6 bg-hpl-surface/90 backdrop-blur-md rounded-2xl p-4 border border-hpl-border shadow-card text-left">
          <div className="flex items-center justify-between pb-3 border-b border-hpl-border">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-hpl-accent">Cricket • Match 1</span>
              <span className="text-xs text-hpl-muted">• Oval Ground</span>
            </div>
            <Badge variant="live" size="sm">LIVE NOW</Badge>
          </div>
          <div className="space-y-2.5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  AL
                </div>
                <span className="text-sm font-bold text-white truncate">Arkavati Lions</span>
              </div>
              <span className="font-mono font-bold text-sm text-white tabular-nums">168/4 (18.2)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  HJ
                </div>
                <span className="text-sm font-bold text-white truncate">Harangi Jaguars</span>
              </div>
              <span className="font-mono font-bold text-sm text-white tabular-nums">172/7 (20.0)</span>
            </div>
          </div>
          <Link href="/matches/match-cricket-live-1" className="block pt-1">
            <div className="w-full py-1.5 px-3 rounded-xl bg-hpl-surface-2 hover:bg-hpl-border text-center text-xs font-semibold text-hpl-accent transition-colors flex items-center justify-center gap-1">
              <span>View Full Live Scorecard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
