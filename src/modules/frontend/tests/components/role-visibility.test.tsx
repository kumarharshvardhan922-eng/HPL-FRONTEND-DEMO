import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminLayout } from "../../components/layout/admin-layout";
import { ServicesProvider } from "../../providers/services-provider";
import { AuthViewProvider } from "../../providers/auth-view-provider";
import { EmptyAuthViewService } from "../../services/empty";

describe("Role-Based Visibility and Access Guard", () => {
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
});

