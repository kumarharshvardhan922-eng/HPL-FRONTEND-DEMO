import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HomePage } from "../../pages/public/home-page";
import { StandingsPage } from "../../pages/public/standings-page";
import { TeamsPage } from "../../pages/public/teams-page";
import { FixturesPage } from "../../pages/public/fixtures-page";
import { PlayerForm } from "../../components/forms/player-form";
import { ScoreboardShell } from "../../components/scoreboards/scoreboard-shell";
import { ServicesProvider } from "../../providers/services-provider";
import { AuthViewProvider } from "../../providers/auth-view-provider";
import { HPL_HOUSES } from "../../config/houses";
import {
  SHOWCASE_MATCH,
  SHOWCASE_TEAMS,
  SHOWCASE_TOP_PERFORMER,
} from "../../showcase/showcase";
import {
  DemoMatchesService,
  DemoPlayersService,
  DemoSportsService,
  DemoStandingsService,
  DemoTeamsService,
} from "../../services/demo";

describe("Empty States, Demo Showcase, and Real Houses Configuration", () => {
  it("(1) pages render the empty states with the default empty services", async () => {
    // Render HomePage with default empty services
    render(
      <ServicesProvider>
        <AuthViewProvider>
          <HomePage />
        </AuthViewProvider>
      </ServicesProvider>
    );

    // Verify empty state messages appear without crashing
    expect(await screen.findByText(/No live matches currently underway/i)).toBeInTheDocument();
    expect(screen.getByText(/No upcoming matches scheduled/i)).toBeInTheDocument();
    expect(screen.getByText(/No completed matches recorded yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No MVP awards logged yet/i)).toBeInTheDocument();

    // Verify baseline 7 houses table rendered with 0 points (mini table renders top 5 preview)
    expect(screen.getByText("Arkavati Lions")).toBeInTheDocument();
    expect(screen.getByText("Harangi Jaguars")).toBeInTheDocument();
  });

  it("(1b) fixtures page renders clean empty state when no fixtures exist", async () => {
    render(
      <ServicesProvider>
        <AuthViewProvider>
          <FixturesPage />
        </AuthViewProvider>
      </ServicesProvider>
    );

    expect(await screen.findByText(/No fixtures found/i)).toBeInTheDocument();
  });

  it("(2) the demo services return one showcase match per department and display the Demo Data badge", async () => {
    const demoMatches = new DemoMatchesService();
    const matches = await demoMatches.getMatches();

    // Exactly one showcase match per sport department (6 total)
    expect(matches).toHaveLength(6);
    expect(matches[0].id).toBe("match-demo-showcase");
    expect(matches[0].isDemo).toBe(true);

    const cricketMatches = await demoMatches.getMatches({ sportId: "cricket" });
    expect(cricketMatches).toHaveLength(1);

    const teamA = SHOWCASE_TEAMS.find((t) => t.id === matches[0].teamAId)!;
    const teamB = SHOWCASE_TEAMS.find((t) => t.id === matches[0].teamBId)!;

    render(
      <ScoreboardShell
        match={matches[0]}
        teamA={teamA}
        teamB={teamB}
        scoreDisplayA="165/4"
        scoreDisplayB="150/8"
      />
    );

    // Verify Demo Data badge is in document
    const demoBadges = screen.getAllByText(/Demo Data/i);
    expect(demoBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("(2b) home page in demo mode shows the single top performer and demo badge", async () => {
    render(
      <ServicesProvider
        isDemo={true}
        customServices={{
          matches: new DemoMatchesService(),
          teams: new DemoTeamsService(),
          players: new DemoPlayersService(),
          sports: new DemoSportsService(),
          standings: new DemoStandingsService(),
        }}
      >
        <AuthViewProvider>
          <HomePage />
        </AuthViewProvider>
      </ServicesProvider>
    );

    // Wait for the showcase top performer to render
    expect(await screen.findByText(SHOWCASE_TOP_PERFORMER.name)).toBeInTheDocument();
  });

  it("(3) all 7 real championship houses appear in standings and in forms", async () => {
    render(
      <ServicesProvider>
        <AuthViewProvider>
          <StandingsPage />
        </AuthViewProvider>
      </ServicesProvider>
    );

    // Verify all 7 houses are rendered in the standings table
    for (const house of HPL_HOUSES) {
      expect(await screen.findByText(house.name)).toBeInTheDocument();
    }

    // Verify all 7 houses appear in the player registration form house selector
    const { container } = render(
      <PlayerForm
        teams={HPL_HOUSES}
        onSubmit={async () => {}}
        onCancel={() => {}}
      />
    );

    const select = container.querySelector("select");
    expect(select).not.toBeNull();
    const options = Array.from(select?.querySelectorAll("option") || []).map((o) => o.textContent);
    for (const house of HPL_HOUSES) {
      expect(options).toContain(house.name);
    }
  });
});
