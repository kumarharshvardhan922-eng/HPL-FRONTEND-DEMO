import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PublicNavbar } from "../../components/layout/public-navbar";
import { PublicFooter } from "../../components/layout/public-footer";
import { HomeHero } from "../../pages/public/home-hero";
import { ServicesProvider } from "../../providers/services-provider";
import { AuthViewProvider } from "../../providers/auth-view-provider";

describe("Logo and Theme Layout Verification", () => {
  it("renders PublicNavbar with circular logo and Image 1 wordmark", () => {
    render(
      <ServicesProvider>
        <AuthViewProvider>
          <PublicNavbar />
        </AuthViewProvider>
      </ServicesProvider>
    );

    const logo = screen.getByAltText("Hostel Premier League logo");
    expect(logo).toBeInTheDocument();
    expect(screen.getByText("PREMIER")).toBeInTheDocument();
    expect(screen.getByText("HOSTEL")).toBeInTheDocument();
    expect(screen.getByText("LEAGUE")).toBeInTheDocument();
  });

  it("renders HomeHero with centered top logo and 7 real houses quick preview", () => {
    render(
      <ServicesProvider>
        <AuthViewProvider>
          <HomeHero />
        </AuthViewProvider>
      </ServicesProvider>
    );

    const heroLogo = screen.getByAltText("Hostel Premier League logo");
    expect(heroLogo).toBeInTheDocument();
    expect(screen.getAllByText("AL").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("HJ").length).toBeGreaterThanOrEqual(1);
  });

  it("renders PublicFooter with circular logo and real houses links", () => {
    render(
      <ServicesProvider>
        <AuthViewProvider>
          <PublicFooter />
        </AuthViewProvider>
      </ServicesProvider>
    );

    expect(screen.getByAltText("Hostel Premier League logo")).toBeInTheDocument();
    expect(screen.getByText(/Arkavati Lions/i)).toBeInTheDocument();
    expect(screen.getByText(/Harangi Jaguars/i)).toBeInTheDocument();
    expect(screen.getByText(/Kabini Lynx/i)).toBeInTheDocument();
    expect(screen.getByText(/Ken Cheetahs/i)).toBeInTheDocument();
    expect(screen.getByText(/View All 7 Houses/i)).toBeInTheDocument();
  });
});
