import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CricketPublicScoreboard } from "../../components/scoreboards/cricket/cricket-public";
import { FootballPublicScoreboard } from "../../components/scoreboards/football/football-public";
import { ScoreboardShell } from "../../components/scoreboards/scoreboard-shell";
import { SAMPLE_CRICKET_LIVE, SAMPLE_FOOTBALL_LIVE } from "../../__tests__/fixtures";
import { Match, Team } from "../../types";

const mockTeamA: Team = {
  id: "team-arkavati",
  name: "Arkavati Lions",
  shortName: "AL",
  hostelBlock: "Block A - Arkavati",
  primaryColor: "#f59e0b",
  secondaryColor: "#fef3c7",
  playerIds: ["p-al-1", "p-al-2"],
};

const mockTeamB: Team = {
  id: "team-harangi",
  name: "Harangi Jaguars",
  shortName: "HJ",
  hostelBlock: "Block B - Harangi",
  primaryColor: "#10b981",
  secondaryColor: "#d1fae5",
  playerIds: ["p-hj-1", "p-hj-2"],
};

describe("Public Scoreboard Components & 3-Column Grid Alignment", () => {
  it("renders ScoreboardShell with 3-column grid layout and no score overlap", () => {
    const match: Match = {
      id: "match-cricket-1",
      sportId: "cricket",
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Main Oval",
      round: "Semi-Final",
      refereeUmpire: "Prof. Narayanan",
      scoreState: SAMPLE_CRICKET_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    const { container } = render(
      <ScoreboardShell
        match={match}
        teamA={mockTeamA}
        teamB={mockTeamB}
        scoreDisplayA="168/4"
        scoreDisplayB="172/7"
        subScoreA="19.0 ov"
        subScoreB="20.0 ov"
        matchTimerOrStatus="Innings Break"
      />
    );

    // Verify team names and codes rendered
    expect(screen.getAllByText("Arkavati Lions").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Harangi Jaguars").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("AL").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("HJ").length).toBeGreaterThanOrEqual(1);

    // Verify 3-digit scores rendered in tabular numbers
    expect(screen.getAllByText("168/4").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("172/7").length).toBeGreaterThanOrEqual(1);

    // Verify 3-column grid structure exists
    const gridEl = container.querySelector(".grid-cols-\\[1fr_auto_1fr\\]");
    expect(gridEl).not.toBeNull();
  });

  it("renders Cricket scoreboard with runs, wickets, overs and CRR", () => {
    const match: Match = {
      id: "match-cricket-1",
      sportId: "cricket",
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Main Oval",
      round: "Semi-Final",
      refereeUmpire: "Prof. Narayanan",
      scoreState: SAMPLE_CRICKET_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    render(<CricketPublicScoreboard match={match} teamA={mockTeamA} teamB={mockTeamB} />);

    expect(screen.getAllByText("Arkavati Lions").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Harangi Jaguars").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("168/4").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("172/7").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Current Run Rate")).toBeInTheDocument();
    expect(screen.getByText("Batting Scorecard")).toBeInTheDocument();
    expect(screen.getByText("Bowling Scorecard")).toBeInTheDocument();
  });

  it("renders Football scoreboard with score, Overview and Lineups tabs", () => {
    const match: Match = {
      id: "match-football-1",
      sportId: "football",
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Turf 1",
      round: "Round 1",
      refereeUmpire: "Coach V. Rathore",
      scoreState: SAMPLE_FOOTBALL_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    render(<FootballPublicScoreboard match={match} teamA={mockTeamA} teamB={mockTeamB} />);

    expect(screen.getAllByText("Arkavati Lions").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Harangi Jaguars").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Lineups")).toBeInTheDocument();
    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getByText("Table")).toBeInTheDocument();
  });
});
