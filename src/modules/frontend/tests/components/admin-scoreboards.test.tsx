import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CricketAdminConsole } from "../../components/scoreboards/cricket/cricket-admin";
import { FootballAdminConsole } from "../../components/scoreboards/football/football-admin";
import { KabaddiAdminConsole } from "../../components/scoreboards/kabaddi/kabaddi-admin";
import { ServicesProvider } from "../../providers/services-provider";
import { SAMPLE_CRICKET_LIVE, SAMPLE_FOOTBALL_LIVE, SAMPLE_KABADDI_LIVE } from "../../mocks/matches-data";
import { Match, Team } from "../../types";

const mockTeamA: Team = {
  id: "team-arkavati",
  name: "Arkavati Lions",
  shortName: "AL",
  hostelBlock: "Block A - Arkavati",
  primaryColor: "#f59e0b",
  secondaryColor: "#fef3c7",
  playerIds: ["p-al-1"],
};

const mockTeamB: Team = {
  id: "team-harangi",
  name: "Harangi Jaguars",
  shortName: "HJ",
  hostelBlock: "Block B - Harangi",
  primaryColor: "#10b981",
  secondaryColor: "#d1fae5",
  playerIds: ["p-hj-1"],
};

describe("Admin Scoring Consoles Live Action Recording", () => {
  it("records cricket run event (+4) and triggers update", async () => {
    const handleUpdate = vi.fn();
    const match: Match = {
      id: "match-cricket-live-1",
      sportId: "cricket",
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Main Oval",
      round: "Semi-Final",
      scoreState: SAMPLE_CRICKET_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
      refereeUmpire: ""
    };

    render(
      <ServicesProvider>
        <CricketAdminConsole match={match} teamA={mockTeamA} teamB={mockTeamB} onUpdate={handleUpdate} />
      </ServicesProvider>
    );

    const fourBtn = screen.getByRole("button", { name: "+4" });
    fireEvent.click(fourBtn);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });

  it("records football goal event and triggers update", async () => {
    const handleUpdate = vi.fn();
    const match: Match = {
      id: "match-football-live-1",
      sportId: "football",
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Turf 1",
      round: "Round 1",
      scoreState: SAMPLE_FOOTBALL_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
      refereeUmpire: ""
    };

    render(
      <ServicesProvider>
        <FootballAdminConsole match={match} teamA={mockTeamA} teamB={mockTeamB} onUpdate={handleUpdate} />
      </ServicesProvider>
    );

    const goalBtns = screen.getAllByRole("button", { name: /Goal for/i });
    expect(goalBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(goalBtns[0]);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });

  it("records kabaddi raid point and triggers update", async () => {
    const handleUpdate = vi.fn();
    const match: Match = {
      id: "match-kabaddi-live-1",
      sportId: "kabaddi",
      teamAId: "team-arkavati",
      teamBId: "team-harangi",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Arena",
      round: "Round 1",
      scoreState: SAMPLE_KABADDI_LIVE,
      events: [],
      lastUpdated: new Date().toISOString(),
      refereeUmpire: ""
    };

    render(
      <ServicesProvider>
        <KabaddiAdminConsole match={match} teamA={mockTeamA} teamB={mockTeamB} onUpdate={handleUpdate} />
      </ServicesProvider>
    );

    const raidBtns = screen.getAllByRole("button", { name: /\+1 Raid/i });
    expect(raidBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(raidBtns[0]);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });
});
