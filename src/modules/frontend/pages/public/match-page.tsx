"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveMatch, useTeams, useStandings, usePlayers } from "../../hooks";
import { useAuthView } from "../../providers/auth-view-provider";
import {
  ScoreHeaderCard,
  PillTabs,
  StatComparisonRow,
  EventsTimeline,
  FootballPitchLineup,
  CricketPublicScoreboard,
  FootballPublicScoreboard,
  KabaddiPublicScoreboard,
  BadmintonPublicScoreboard,
  VolleyballPublicScoreboard,
  BasketballPublicScoreboard,
} from "../../components/scoreboards";
import { ScoreboardSkeleton } from "../../components/ui/skeleton";
import { ErrorState } from "../../components/ui/error-state";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { ArrowLeft, Edit3, MoreVertical, Clock, Shield } from "lucide-react";
import { formatTimeOnly, getInitials } from "../../utils/formatters";
import { calculateRunRate } from "../../utils/cricket-calc";
import { Team, Player } from "../../types";

export interface MatchPageProps {
  matchId: string;
}

export const MatchPage: React.FC<MatchPageProps> = ({ matchId }) => {
  const router = useRouter();
  const { match, isLoading, error, lastUpdated } = useLiveMatch(matchId);
  const { teams } = useTeams();
  const { players } = usePlayers();
  const { isPermittedForSport } = useAuthView();
  const { standings } = useStandings(match?.sportId || "cricket");
  const [activeTab, setActiveTab] = useState<string>("stats");
  const [showMenu, setShowMenu] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <ScoreboardSkeleton />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          title="Match Not Found"
          message={error || "The requested match could not be retrieved from the tournament database."}
        />
        <div className="text-center mt-6">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const teamA = teams.find((t) => t.id === match.teamAId);
  const teamB = teams.find((t) => t.id === match.teamBId);
  const teamsMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const canScore = isPermittedForSport(match.sportId);

  const teamAPlayers = players.filter((p) => p.teamId === match.teamAId);
  const teamBPlayers = players.filter((p) => p.teamId === match.teamBId);

  // Per-sport stats mapping
  const renderSportStats = () => {
    const s = match.scoreState;
    if (!s) return null;

    if (s.sportId === "cricket") {
      const rrA = calculateRunRate(s.runsA, s.oversA, s.ballsA);
      const rrB = calculateRunRate(s.runsB, s.oversB, s.ballsB);
      const extrasCountA = s.extrasA
        ? s.extrasA.wides + s.extrasA.noBalls + s.extrasA.byes + s.extrasA.legByes
        : 0;
      const extrasCountB = s.extrasB
        ? s.extrasB.wides + s.extrasB.noBalls + s.extrasB.byes + s.extrasB.legByes
        : 0;

      return (
        <div className="space-y-4">
          <StatComparisonRow label="Runs" leftValue={s.runsA} rightValue={s.runsB} />
          <StatComparisonRow label="Wickets" leftValue={s.wicketsA} rightValue={s.wicketsB} />
          <StatComparisonRow label="Run Rate" leftValue={rrA.toFixed(2)} rightValue={rrB.toFixed(2)} />
          <StatComparisonRow label="Extras" leftValue={extrasCountA} rightValue={extrasCountB} />
          <StatComparisonRow label="Overs Completed" leftValue={`${s.oversA}.${s.ballsA}`} rightValue={`${s.oversB}.${s.ballsB}`} />
        </div>
      );
    }

    if (s.sportId === "football") {
      return (
        <div className="space-y-4">
          <StatComparisonRow label="Goals" leftValue={s.goalsA} rightValue={s.goalsB} />
          <StatComparisonRow label="Shots on Goal" leftValue={s.shotsOnTargetA || 0} rightValue={s.shotsOnTargetB || 0} />
          <StatComparisonRow label="Shots" leftValue={s.shotsA || 0} rightValue={s.shotsB || 0} />
          <StatComparisonRow label="Possession %" leftValue={`${s.possessionA || 50}%`} rightValue={`${s.possessionB || 50}%`} />
          <StatComparisonRow label="Yellow card" leftValue={s.yellowCardsA || 0} rightValue={s.yellowCardsB || 0} />
          <StatComparisonRow label="Corner kicks" leftValue={s.cornersA || 0} rightValue={s.cornersB || 0} />
          <StatComparisonRow label="Fouls" leftValue={s.foulsA || 0} rightValue={s.foulsB || 0} />
        </div>
      );
    }

    if (s.sportId === "kabaddi") {
      return (
        <div className="space-y-4">
          <StatComparisonRow label="Total Score" leftValue={s.scoreA} rightValue={s.scoreB} />
          <StatComparisonRow label="Raid points" leftValue={s.raidPointsA || 0} rightValue={s.raidPointsB || 0} />
          <StatComparisonRow label="Tackle points" leftValue={s.tacklePointsA || 0} rightValue={s.tacklePointsB || 0} />
          <StatComparisonRow label="Bonus points" leftValue={s.bonusPointsA || 0} rightValue={s.bonusPointsB || 0} />
          <StatComparisonRow label="All-Outs" leftValue={s.allOutsA || 0} rightValue={s.allOutsB || 0} />
        </div>
      );
    }

    if (s.sportId === "badminton") {
      return (
        <div className="space-y-4">
          <StatComparisonRow label="Sets Won" leftValue={s.setsWonA || 0} rightValue={s.setsWonB || 0} />
          <StatComparisonRow label="Current Game" leftValue={s.currentScoreA || 0} rightValue={s.currentScoreB || 0} />
        </div>
      );
    }

    if (s.sportId === "volleyball") {
      return (
        <div className="space-y-4">
          <StatComparisonRow label="Sets Won" leftValue={s.setsWonA || 0} rightValue={s.setsWonB || 0} />
          <StatComparisonRow label="Current Set Score" leftValue={s.currentScoreA || 0} rightValue={s.currentScoreB || 0} />
          <StatComparisonRow label="Timeouts Remaining" leftValue={s.timeoutsRemainingA || 0} rightValue={s.timeoutsRemainingB || 0} />
        </div>
      );
    }

    if (s.sportId === "basketball") {
      return (
        <div className="space-y-4">
          <StatComparisonRow label="Total Points" leftValue={s.scoreA || 0} rightValue={s.scoreB || 0} />
          <StatComparisonRow label="Team Fouls" leftValue={s.teamFoulsA || 0} rightValue={s.teamFoulsB || 0} />
          <StatComparisonRow label="Timeouts Left" leftValue={s.timeoutsRemainingA || 0} rightValue={s.timeoutsRemainingB || 0} />
        </div>
      );
    }

    return null;
  };

  const tabs = [
    { id: "stats", label: "Stats" },
    { id: "lineup", label: "Line-up" },
    { id: "summary", label: "Summary" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Reference Image Header: Back button | Match title (sport name) | Menu button */}
      <div className="flex items-center justify-between pb-2 border-b border-hpl-border/50 relative">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-[rgba(11,26,40,0.78)] border border-hpl-border flex items-center justify-center text-white hover:text-hpl-accent hover:border-hpl-accent transition-colors focus:outline-none"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-lg font-black text-white capitalize font-display tracking-wide">
            {match.sportId} Championship
          </h1>
          <p className="text-[10px] text-hpl-muted uppercase tracking-wider">{match.round}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full bg-[rgba(11,26,40,0.78)] border border-hpl-border flex items-center justify-center text-white hover:text-hpl-accent hover:border-hpl-accent transition-colors focus:outline-none"
            aria-label="Match Options Menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-hpl-surface border border-hpl-border shadow-2xl p-1.5 z-50 text-xs">
              <Link
                href={`/sports/${match.sportId}`}
                className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-hpl-surface-2 hover:text-white"
              >
                All {match.sportId.toUpperCase()} Matches
              </Link>
              <Link
                href="/fixtures"
                className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-hpl-surface-2 hover:text-white"
              >
                Fixtures Calendar
              </Link>
              {canScore && (
                <Link
                  href={`/admin/scoring/${match.id}`}
                  className="block px-3 py-2 rounded-lg text-hpl-accent hover:bg-hpl-surface-2 font-bold"
                >
                  Admin Scoring Console
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ScoreHeaderCard */}
      <ScoreHeaderCard match={match} teamA={teamA} teamB={teamB} />

      {/* PillTabs: Stats / Line-up / Summary */}
      <div className="flex justify-center">
        <PillTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Active Tab Panel */}
      <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="space-y-6">
        {activeTab === "stats" && (
          <div className="rounded-2xl bg-[rgba(11,26,40,0.78)] backdrop-blur-md border border-hpl-border p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hpl-border/60 text-xs font-bold text-white">
              <span>{teamA?.name || match.teamAId}</span>
              <span className="text-hpl-muted text-[11px] font-normal uppercase tracking-wider">Comparative Stats</span>
              <span>{match.teamBId === "bye" ? "BYE" : teamB?.name || match.teamBId}</span>
            </div>
            {renderSportStats()}
          </div>
        )}

        {activeTab === "lineup" && (
          <div className="space-y-6">
            {match.sportId === "football" && teamA && (
              <FootballPitchLineup
                team={teamA}
                formation={"4-4-2"}
                players={teamAPlayers.map((p, idx) => ({
                  id: p.id,
                  name: p.name,
                  jerseyNumber: p.jerseyNumber || idx + 1,
                  rating: 7.0,
                  position: p.role,
                }))}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* House A Roster */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-hpl-accent" />
                    <span>{teamA?.name || "House A"} Squad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {teamAPlayers.length === 0 ? (
                    <p className="text-xs text-hpl-muted">No squad players listed.</p>
                  ) : (
                    teamAPlayers.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-hpl-surface-2 border border-hpl-border/50 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-hpl-surface flex items-center justify-center font-mono font-bold text-hpl-accent text-[11px]">
                            {p.jerseyNumber || "-"}
                          </span>
                          <span className="font-semibold text-white">{p.name}</span>
                        </div>
                        <span className="text-hpl-muted text-[11px]">{p.role}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* House B Roster */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-hpl-accent" />
                    <span>{teamB?.name || "House B"} Squad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {teamBPlayers.length === 0 ? (
                    <p className="text-xs text-hpl-muted">No squad players listed.</p>
                  ) : (
                    teamBPlayers.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-hpl-surface-2 border border-hpl-border/50 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-hpl-surface flex items-center justify-center font-mono font-bold text-hpl-accent text-[11px]">
                            {p.jerseyNumber || "-"}
                          </span>
                          <span className="font-semibold text-white">{p.name}</span>
                        </div>
                        <span className="text-hpl-muted text-[11px]">{p.role}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "summary" && (
          <EventsTimeline events={match.events || []} teams={teamsMap} isLive={match.status === "live"} />
        )}
      </div>

      {/* Sport-Specific Detailed Live Scoreboard Console (Kept fully functional) */}
      <div className="pt-6 border-t border-hpl-border space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-hpl-muted">
          Sport Specific Scoreboard
        </h3>
        {match.sportId === "cricket" && (
          <CricketPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
        )}
        {match.sportId === "football" && (
          <FootballPublicScoreboard match={match} teamA={teamA} teamB={teamB} standings={standings} />
        )}
        {match.sportId === "kabaddi" && (
          <KabaddiPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
        )}
        {match.sportId === "badminton" && (
          <BadmintonPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
        )}
        {match.sportId === "volleyball" && (
          <VolleyballPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
        )}
        {match.sportId === "basketball" && (
          <BasketballPublicScoreboard match={match} teamA={teamA} teamB={teamB} />
        )}
      </div>
    </div>
  );
};
