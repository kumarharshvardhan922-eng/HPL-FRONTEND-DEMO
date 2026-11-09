import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TeamForm } from "../../components/forms/team-form";
import { PlayerForm } from "../../components/forms/player-form";
import { AdminInviteForm } from "../../components/forms/admin-invite-form";
import { Team } from "../../types";

const mockTeams: Team[] = [
  {
    id: "team-arkavati",
    name: "Arkavati Lions",
    shortName: "AL",
    hostelBlock: "Block A - Arkavati",
    primaryColor: "#f59e0b",
    secondaryColor: "#fef3c7",
    playerIds: [],
  },
  {
    id: "team-harangi",
    name: "Harangi Jaguars",
    shortName: "HJ",
    hostelBlock: "Block B - Harangi",
    primaryColor: "#10b981",
    secondaryColor: "#d1fae5",
    playerIds: [],
  },
];

describe("Admin Forms Submissions and Validations", () => {
  it("submits TeamForm (House) with valid input", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleCancel = vi.fn();

    render(<TeamForm onSubmit={handleSubmit} onCancel={handleCancel} />);

    fireEvent.change(screen.getByLabelText(/House Name/i), { target: { value: "Tons Tigers" } });
    fireEvent.change(screen.getByLabelText(/House Code/i), { target: { value: "TT" } });
    fireEvent.change(screen.getByLabelText(/House Block/i), { target: { value: "Block G - Tons" } });

    fireEvent.click(screen.getByRole("button", { name: /Create House/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Tons Tigers",
          shortName: "TT",
          hostelBlock: "Block G - Tons",
        })
      );
    });
  });

  it("submits PlayerForm with valid athlete information", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleCancel = vi.fn();

    render(<PlayerForm teams={mockTeams} onSubmit={handleSubmit} onCancel={handleCancel} />);

    fireEvent.change(screen.getByLabelText(/Player Full Name/i), { target: { value: "Manish Pandey" } });
    fireEvent.change(screen.getByLabelText(/Jersey Number/i), { target: { value: "18" } });
    fireEvent.change(screen.getByLabelText(/Position \/ Role/i), { target: { value: "Top Order Batsman" } });

    fireEvent.click(screen.getByRole("button", { name: /Register Athlete/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Manish Pandey",
          jerseyNumber: 18,
          role: "Top Order Batsman",
        })
      );
    });
  });

  it("submits AdminInviteForm with valid operator data", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleCancel = vi.fn();

    render(<AdminInviteForm onSubmit={handleSubmit} onCancel={handleCancel} />);

    fireEvent.change(screen.getByLabelText(/Admin Email Address/i), { target: { value: "referee@hpl.ac.in" } });
    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: "Prof. Sen" } });

    fireEvent.click(screen.getByRole("button", { name: /Send Invitation/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "referee@hpl.ac.in",
          displayName: "Prof. Sen",
          role: "sport_admin",
        })
      );
    });
  });
});
