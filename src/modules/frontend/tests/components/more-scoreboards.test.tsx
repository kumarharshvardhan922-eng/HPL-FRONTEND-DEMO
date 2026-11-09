import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KabaddiPublicScoreboard } from "../../components/scoreboards/kabaddi/kabaddi-public";
import { BadmintonPublicScoreboard } from "../../components/scoreboards/badminton/badminton-public";
import { VolleyballPublicScoreboard } from "../../components/scoreboards/volleyball/volleyball-public";
import { BasketballPublicScoreboard } from "../../components/scoreboards/basketball/basketball-public";
import {
  SAMPLE_KABADDI_LIVE,
  SAMPLE_BADMINTON_LIVE,
  SAMPLE_VOLLEYBALL_LIVE,
  SAMPLE_BASKETBALL_LIVE,
} from "../../mocks/matches-data";
import { Match, Team } from "../../types";

const mockTeamA: Team = {
  id: "team-kabini",
  name: "Kabini Lynx",
  shortName: "KL",
  hostelBlock: "Block C - Kabini",
  primaryColor: "#38b6ff",
  secondaryColor: "#8fd8ff",
  playerIds: ["p-kl-1"],
};

const mockTeamB: Team = {
  id: "team-ken",
  name: "Ken Cheetahs",
  shortName: "KC",
  hostelBlock: "Block D - Ken",
  primaryColor: "#f97316",
  secondaryColor: "#ffedd5",
  playerIds: ["p-kc-1"],
};

describe("Additional Sport Public Scoreboards", () => {
  it("renders Kabaddi scoreboard with raid, tackle, and bonus points", () => {
    const match: Match = {
      id: "match-kabaddi-1",
      sportId: "kabaddi",
      teamAId: "team-kabini",
      teamBId: "team-ken",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Arena",
      round: "Round 1",
      refereeUmpire: "Ref 1",
      scoreState: SAMPLE_KABADDI_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    render(<KabaddiPublicScoreboard match={match} teamA={mockTeamA} teamB={mockTeamB} />);
    expect(screen.getAllByText("Kabini Lynx").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Ken Cheetahs").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Raid Points")).toBeInTheDocument();
    expect(screen.getByText("Tackle Points")).toBeInTheDocument();
    expect(screen.getByText("Bonus Points")).toBeInTheDocument();
  });

  it("renders Badminton scoreboard with best of 3 game history", () => {
    const match: Match = {
      id: "match-badminton-1",
      sportId: "badminton",
      teamAId: "team-kabini",
      teamBId: "team-ken",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Court A",
      round: "Round 1",
      refereeUmpire: "Ref 2",
      scoreState: SAMPLE_BADMINTON_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    render(<BadmintonPublicScoreboard match={match} teamA={mockTeamA} teamB={mockTeamB} />);
    expect(screen.getAllByText("Kabini Lynx").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Ken Cheetahs").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Game History (Best of 3)")).toBeInTheDocument();
  });

  it("renders Volleyball scoreboard with set-by-set history", () => {
    const match: Match = {
      id: "match-volleyball-1",
      sportId: "volleyball",
      teamAId: "team-kabini",
      teamBId: "team-ken",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Court 1",
      round: "Round 1",
      refereeUmpire: "Ref 3",
      scoreState: SAMPLE_VOLLEYBALL_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    render(<VolleyballPublicScoreboard match={match} teamA={mockTeamA} teamB={mockTeamB} />);
    expect(screen.getAllByText("Kabini Lynx").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Set-by-Set History")).toBeInTheDocument();
  });

  it("renders Basketball scoreboard with quarter scores and team fouls", () => {
    const match: Match = {
      id: "match-basketball-1",
      sportId: "basketball",
      teamAId: "team-kabini",
      teamBId: "team-ken",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Hardcourt",
      round: "Round 1",
      refereeUmpire: "Ref 4",
      scoreState: SAMPLE_BASKETBALL_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    render(<BasketballPublicScoreboard match={match} teamA={mockTeamA} teamB={mockTeamB} />);
    expect(screen.getAllByText("Kabini Lynx").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Quarter Scores")).toBeInTheDocument();
  });
});
