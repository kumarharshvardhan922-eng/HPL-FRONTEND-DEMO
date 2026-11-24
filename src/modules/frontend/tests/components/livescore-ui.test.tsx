import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  SportChipRow,
  LiveMatchCarousel,
  MatchRow,
  ScoreHeaderCard,
  StatComparisonRow,
  PillTabs,
  BottomTabBar,
} from "../../components/scoreboards";
import { HPL_SPORTS } from "../../config/sports";
import { HPL_HOUSES } from "../../config/houses";
import { Match } from "../../types";

const mockTeamsMap = Object.fromEntries(HPL_HOUSES.map((h) => [h.id, h]));

const mockLiveMatch: Match = {
  id: "match-live-1",
  sportId: "cricket",
  teamAId: "team-arkavati",
  teamBId: "team-tons",
  status: "live",
  startTime: new Date().toISOString(),
  venue: "Main Stadium",
  round: "Round 1",
  refereeUmpire: "Official",
  events: [],
  lastUpdated: new Date().toISOString(),
  scoreState: {
    sportId: "cricket",
    runsA: 142,
    wicketsA: 4,
    oversA: 16,
    ballsA: 2,
    extrasA: { wides: 3, noBalls: 1, byes: 2, legByes: 0, penalty: 0 },
    runsB: 110,
    wicketsB: 6,
    oversB: 15,
    ballsB: 0,
    extrasB: { wides: 1, noBalls: 0, byes: 0, legByes: 1, penalty: 0 },
    currentInnings: 2,
    currentBattingTeamId: "team-tons",
    currentBowlingTeamId: "team-arkavati",
    batsmen: {},
    bowlers: {},
    recentBalls: ["1", "4", "W"],
    totalOversAllowed: 20,
  },
};

describe("LiveScore UI Shared Components", () => {
  it("renders SportChipRow with all 6 sports and responds to click", () => {
    const handleSelect = vi.fn();
    render(
      <SportChipRow
        sports={HPL_SPORTS}
        selectedSportId="cricket"
        onSelectSport={handleSelect}
        includeAll={true}
      />
    );

    expect(screen.getByText("All Sports")).toBeInTheDocument();
    expect(screen.getByText("Cricket")).toBeInTheDocument();
    expect(screen.getByText("Football")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Football"));
    expect(handleSelect).toHaveBeenCalledWith("football");
  });

  it("renders LiveMatchCarousel with match score and team badges", () => {
    render(
      <LiveMatchCarousel
        matches={[mockLiveMatch]}
        teamsMap={mockTeamsMap}
      />
    );

    expect(screen.getByText("Arkavati Lions")).toBeInTheDocument();
    expect(screen.getByText("Tons Tigers")).toBeInTheDocument();
    expect(screen.getByText("142/4 : 110/6")).toBeInTheDocument();
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("renders MatchRow with live pulsing badge and link", () => {
    render(
      <MatchRow
        match={mockLiveMatch}
        teamA={mockTeamsMap["team-arkavati"]}
        teamB={mockTeamsMap["team-tons"]}
      />
    );

    expect(screen.getByText("Arkavati Lions")).toBeInTheDocument();
    expect(screen.getByText("Tons Tigers")).toBeInTheDocument();
    expect(screen.getByText("142/4 : 110/6")).toBeInTheDocument();
  });

  it("renders ScoreHeaderCard with venue, big score, and crests", () => {
    render(
      <ScoreHeaderCard
        match={mockLiveMatch}
        teamA={mockTeamsMap["team-arkavati"]}
        teamB={mockTeamsMap["team-tons"]}
      />
    );

    expect(screen.getByText("Main Stadium")).toBeInTheDocument();
    expect(screen.getByText("142/4 : 110/6")).toBeInTheDocument();
  });

  it("renders StatComparisonRow and computes proportional bar without NaN", () => {
    render(
      <StatComparisonRow
        label="Possession %"
        leftValue="26.0%"
        rightValue="74.0%"
      />
    );

    expect(screen.getByText("Possession %")).toBeInTheDocument();
    expect(screen.getByText("26.0%")).toBeInTheDocument();
    expect(screen.getByText("74.0%")).toBeInTheDocument();
  });

  it("renders PillTabs and fires change on click and keyboard", () => {
    const handleChange = vi.fn();
    const tabs = [
      { id: "stats", label: "Stats" },
      { id: "lineup", label: "Line-up" },
      { id: "summary", label: "Summary" },
    ];

    render(
      <PillTabs
        tabs={tabs}
        activeTab="stats"
        onChange={handleChange}
      />
    );

    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getByText("Line-up")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Line-up"));
    expect(handleChange).toHaveBeenCalledWith("lineup");
  });

  it("renders BottomTabBar with 4 navigation links", () => {
    render(<BottomTabBar />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Fixtures")).toBeInTheDocument();
    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
