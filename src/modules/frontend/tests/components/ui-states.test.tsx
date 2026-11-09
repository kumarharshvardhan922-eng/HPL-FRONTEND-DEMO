import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";

describe("UI State Components", () => {
  it("renders EmptyState and triggers action", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No fixtures found"
        description="Check upcoming rounds"
        actionLabel="Refresh List"
        onAction={handleAction}
      />
    );

    expect(screen.getByText("No fixtures found")).toBeInTheDocument();
    expect(screen.getByText("Check upcoming rounds")).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: /Refresh List/i });
    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("renders ErrorState with retry button", () => {
    const handleRetry = vi.fn();
    render(<ErrorState title="Failed to load" message="Network timeout" onRetry={handleRetry} />);

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    expect(screen.getByText("Network timeout")).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: /Retry/i });
    fireEvent.click(btn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renders ConfirmDialog and triggers confirm or cancel", () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Team"
        message="Are you sure you want to proceed?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    expect(screen.getByText("Delete Team")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to proceed?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(handleCancel).toHaveBeenCalledTimes(1);

    rerender(
      <ConfirmDialog
        isOpen={false}
        title="Delete Team"
        message="Are you sure you want to proceed?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
    expect(screen.queryByText("Delete Team")).not.toBeInTheDocument();
  });
});

