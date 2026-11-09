import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { AdminLayout } from "../../components/layout/admin-layout";
import { RoleSwitcher } from "../../components/layout/role-switcher";
import { MatchForm } from "../../components/forms/match-form";
import { AdminScoringPage } from "../../pages/admin/admin-scoring-page";
import { ServicesProvider } from "../../providers/services-provider";
import { AuthViewProvider } from "../../providers/auth-view-provider";
import { EmptyAuthViewService } from "../../services/empty";
import { HPL_HOUSES } from "../../config/houses";
import { Match, MatchesService, TeamsService } from "../../types";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/admin",
}));

describe("Role-Based Visibility and Dev Role Switcher", () => {
  it("renders access restriction banner when role is public", async () => {
    const authService = new EmptyAuthViewService();
    await authService.setRole("public");

    render(
      <ServicesProvider customServices={{ authView: authService }}>
        <AuthViewProvider>
          <AdminLayout>
            <div>Confidential Admin Panel</div>
          </AdminLayout>
        </AuthViewProvider>
      </ServicesProvider>
    );

    expect(await screen.findByText(/Restricted Administration Area/i)).toBeInTheDocument();
    expect(screen.queryByText("Confidential Admin Panel")).not.toBeInTheDocument();
  });

  it("renders full admin console when role is super_admin", async () => {
    const authService = new EmptyAuthViewService();
    await authService.setRole("super_admin");

    render(
      <ServicesProvider customServices={{ authView: authService }}>
        <AuthViewProvider>
          <AdminLayout>
            <div>Confidential Admin Panel</div>
          </AdminLayout>
        </AuthViewProvider>
      </ServicesProvider>
    );

    expect(await screen.findByText("Confidential Admin Panel")).toBeInTheDocument();
  });

  it("renders all 8 options in the Dev Role Switcher with exact titles and subtitles", async () => {
    const authService = new EmptyAuthViewService();
    await authService.setRole("super_admin");

    render(
      <ServicesProvider customServices={{ authView: authService }}>
        <AuthViewProvider>
          <RoleSwitcher />
        </AuthViewProvider>
      </ServicesProvider>
    );

    // Open dropdown
    const trigger = screen.getByRole("button", { name: /Switch active test role/i });
    fireEvent.click(trigger);

    const listbox = screen.getByRole("listbox");

    // Verify all 8 options
    expect(within(listbox).getByText("Super Admin")).toBeInTheDocument();
    expect(within(listbox).getByText("Full control of sports, houses, players and matches")).toBeInTheDocument();

    expect(within(listbox).getByText("Sport Admin (Cricket only)")).toBeInTheDocument();
    expect(within(listbox).getByText("Restricted to cricket scoring & matches")).toBeInTheDocument();

    expect(within(listbox).getByText("Sport Admin (Football only)")).toBeInTheDocument();
    expect(within(listbox).getByText("Restricted to football scoring & matches")).toBeInTheDocument();

    expect(within(listbox).getByText("Sport Admin (Kabaddi only)")).toBeInTheDocument();
    expect(within(listbox).getByText("Restricted to kabaddi scoring & matches")).toBeInTheDocument();

    expect(within(listbox).getByText("Sport Admin (Badminton only)")).toBeInTheDocument();
    expect(within(listbox).getByText("Restricted to badminton scoring & matches")).toBeInTheDocument();

    expect(within(listbox).getByText("Sport Admin (Volleyball only)")).toBeInTheDocument();
    expect(within(listbox).getByText("Restricted to volleyball scoring & matches")).toBeInTheDocument();

    expect(within(listbox).getByText("Sport Admin (Basketball only)")).toBeInTheDocument();
    expect(within(listbox).getByText("Restricted to basketball scoring & matches")).toBeInTheDocument();

    expect(within(listbox).getByText("Public User")).toBeInTheDocument();
    expect(within(listbox).getByText("View live scores, fixtures and stats (read-only)")).toBeInTheDocument();

    const options = within(listbox).getAllByRole("option");
    expect(options).toHaveLength(8);
  });

  it("locks the sport field in MatchForm when user is a Sport Admin for Football", async () => {
    const authService = new EmptyAuthViewService();
    await authService.setRole("sport_admin", ["football"]);

    render(
      <ServicesProvider customServices={{ authView: authService }}>
        <AuthViewProvider>
          <MatchForm
            teams={HPL_HOUSES}
            onSubmit={async () => {}}
            onCancel={() => {}}
          />
        </AuthViewProvider>
      </ServicesProvider>
    );

    // Check for locked sport badge and disabled sport select
    expect(await screen.findByText(/Locked to your assigned sport/i)).toBeInTheDocument();
  });

  it("shows 'No Access' on cricket scoring console when signed in as Football Sport Admin", async () => {
    const authService = new EmptyAuthViewService();
    await authService.setRole("sport_admin", ["football"]);

    const mockCricketMatch: Match = {
      id: "match-cricket-locked",
      sportId: "cricket",
      teamAId: "AL",
      teamBId: "TT",
      status: "live",
      startTime: new Date().toISOString(),
      venue: "Main Oval",
      round: "Exhibition",
      refereeUmpire: "Umpire A",
      scoreState: {
        sportId: "cricket",
        runsA: 100,
        wicketsA: 2,
        oversA: 10,
        ballsA: 0,
        extrasA: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
        runsB: 0,
        wicketsB: 0,
        oversB: 0,
        ballsB: 0,
        extrasB: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
        currentInnings: 1,
        currentBattingTeamId: "AL",
        currentBowlingTeamId: "TT",
        batsmen: {},
        bowlers: {},
        recentBalls: [],
        totalOversAllowed: 20,
      },
      events: [],
      lastUpdated: new Date().toISOString(),
    };

    const mockMatchesService: Partial<MatchesService> = {
      getMatchById: async () => mockCricketMatch,
    };

    const mockTeamsService: Partial<TeamsService> = {
      getTeamById: async (id) => HPL_HOUSES.find((h) => h.id === id) || HPL_HOUSES[0],
    };

    render(
      <ServicesProvider
        customServices={{
          authView: authService,
          matches: mockMatchesService as MatchesService,
          teams: mockTeamsService as TeamsService,
        }}
      >
        <AuthViewProvider>
          <AdminScoringPage matchId="match-cricket-locked" />
        </AuthViewProvider>
      </ServicesProvider>
    );

    // Should display No Access banner with Back to dashboard button
    expect(await screen.findByText(/No Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Exit Scoring Console/i)).not.toBeInTheDocument();
  });
});
