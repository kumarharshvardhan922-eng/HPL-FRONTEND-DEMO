"use client";

import React, { useState } from "react";
import { FootballScoreState, Match, Team, Standing } from "../../../types";
import { ScoreboardShell } from "../scoreboard-shell";
import { Tabs } from "../../ui/tabs";
import { EventsTimeline } from "../events-timeline";
import { StatsPanel } from "../stats-panel";
import { FootballPitchLineup, PitchPlayer } from "./football-pitch-lineup";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { formatMatchHalves } from "../../../utils/football-calc";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/table";

export interface FootballPublicScoreboardProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  standings?: Standing[];
}

export const FootballPublicScoreboard: React.FC<FootballPublicScoreboardProps> = ({
  match,
  teamA,
  teamB,
  standings = [],
}) => {
  const state = match.scoreState as FootballScoreState;
  const [activeTab, setActiveTab] = useState("overview");
  const [lineupTeamToggle, setLineupTeamToggle] = useState<"A" | "B">("A");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Timeline" },
    { id: "lineups", label: "Lineups" },
    { id: "stats", label: "Stats" },
    { id: "table", label: "Table" },
  ];

  // Fictional pitch players for lineup view
  const makePitchPlayers = (teamPrefix: string): PitchPlayer[] =>
    Array.from({ length: 11 }, (_, i) => ({
      id: `p-${teamPrefix}-${i + 1}`,
      name: `Player ${i + 1}`,
      jerseyNumber: i === 0 ? 1 : i + 2,
      rating: state.playerRatings[`p-${teamPrefix}-${i + 1}`] || 6.5 + (i % 3) * 0.7,
      position: i === 0 ? "GK" : i < 5 ? "DEF" : i < 9 ? "MID" : "ATT",
    }));

  const pitchPlayersA = makePitchPlayers(match.teamAId.replace("team-", ""));
  const pitchPlayersB = makePitchPlayers(match.teamBId.replace("team-", ""));

  const scorersA = state.goals.filter((g) => g.teamId === match.teamAId);
  const scorersB = state.goals.filter((g) => g.teamId === match.teamBId);

  return (
    <div className="space-y-6">
      {/* Scoreboard Header */}
      <ScoreboardShell
        match={match}
        teamA={teamA}
        teamB={teamB}
        scoreDisplayA={state.goalsA}
        scoreDisplayB={state.goalsB}
        matchTimerOrStatus={
          match.status === "completed"
            ? "Full-time"
            : formatMatchHalves(state.matchTimeMinutes, state.extraTimeMinutes)
        }
      >
        {/* Scorers strip directly matching Image 3 */}
        {state.goals.length > 0 && (
          <div className="grid grid-cols-2 gap-4 text-xs pt-2 text-purple-200">
            <div className="text-right space-y-0.5">
              {scorersA.map((g, i) => (
                <div key={i}>
                  ⚽ {g.playerInitials} {g.minute}&apos;
                </div>
              ))}
            </div>
            <div className="text-left space-y-0.5">
              {scorersB.map((g, i) => (
                <div key={i}>
                  ⚽ {g.playerInitials} {g.minute}&apos;
                </div>
              ))}
            </div>
          </div>
        )}
      </ScoreboardShell>

      {/* Tabs matching Image 3: Overview / Timeline / Lineups / Stats / Table */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsPanel
            teamAName={teamA?.name || "Team A"}
            teamBName={teamB?.name || "Team B"}
            stats={[
              { label: "Possession", valA: state.possessionA, valB: state.possessionB, unit: "%", total: 100 },
              { label: "Total Shots", valA: state.shotsA, valB: state.shotsB },
              { label: "Shots on Target", valA: state.shotsOnTargetA, valB: state.shotsOnTargetB },
              { label: "Corners", valA: state.cornersA, valB: state.cornersB },
              { label: "Yellow Cards", valA: state.yellowCardsA, valB: state.yellowCardsB },
            ]}
          />
          <EventsTimeline
            events={match.events}
            teams={{ [match.teamAId]: teamA as Team, [match.teamBId]: teamB as Team }}
          />
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <EventsTimeline
          events={match.events}
          teams={{ [match.teamAId]: teamA as Team, [match.teamBId]: teamB as Team }}
        />
      )}

      {/* Lineups Tab - Pitch tactical formation matching Image 3 */}
      {activeTab === "lineups" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setLineupTeamToggle("A")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                lineupTeamToggle === "A"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-purple-50 border border-purple-100"
              }`}
            >
              {teamA?.name || "Team A"} Lineup
            </button>
            <button
              onClick={() => setLineupTeamToggle("B")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                lineupTeamToggle === "B"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-purple-50 border border-purple-100"
              }`}
            >
              {teamB?.name || "Team B"} Lineup
            </button>
          </div>

          <FootballPitchLineup
            team={(lineupTeamToggle === "A" ? teamA : teamB) || ({ name: "Team" } as Team)}
            formation={lineupTeamToggle === "A" ? state.formationA : state.formationB}
            players={lineupTeamToggle === "A" ? pitchPlayersA : pitchPlayersB}
          />
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <StatsPanel
          teamAName={teamA?.name || "Team A"}
          teamBName={teamB?.name || "Team B"}
          stats={[
            { label: "Possession", valA: state.possessionA, valB: state.possessionB, unit: "%", total: 100 },
            { label: "Shots", valA: state.shotsA, valB: state.shotsB },
            { label: "Shots on Target", valA: state.shotsOnTargetA, valB: state.shotsOnTargetB },
            { label: "Corners", valA: state.cornersA, valB: state.cornersB },
            { label: "Fouls", valA: state.foulsA, valB: state.foulsB },
            { label: "Yellow Cards", valA: state.yellowCardsA, valB: state.yellowCardsB },
            { label: "Red Cards", valA: state.redCardsA, valB: state.redCardsB },
          ]}
        />
      )}

      {/* Table Tab */}
      {activeTab === "table" && (
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Football Points Table</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hostel</TableHead>
                  <TableHead className="text-right">P</TableHead>
                  <TableHead className="text-right">W</TableHead>
                  <TableHead className="text-right">D</TableHead>
                  <TableHead className="text-right">L</TableHead>
                  <TableHead className="text-right">GD</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((s, idx) => (
                  <TableRow key={s.teamId}>
                    <TableCell className="font-semibold">
                      <span className="text-slate-400 mr-2 text-xs">{idx + 1}</span>
                      {s.teamName}
                    </TableCell>
                    <TableCell className="text-right">{s.played}</TableCell>
                    <TableCell className="text-right text-emerald-700 font-bold">{s.won}</TableCell>
                    <TableCell className="text-right">{s.tied}</TableCell>
                    <TableCell className="text-right text-red-600">{s.lost}</TableCell>
                    <TableCell className="text-right font-mono">
                      {s.goalDifference !== undefined && s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                    </TableCell>
                    <TableCell className="text-right font-black text-purple-900">{s.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

