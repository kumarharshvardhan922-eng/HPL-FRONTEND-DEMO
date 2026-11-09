import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteBackground } from "../../components/layout/site-background";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("SiteBackground Component", () => {
  it("renders with aria-hidden='true' and print:hidden", () => {
    render(<SiteBackground variant="hero" />);
    const bg = screen.getByTestId("site-background");
    expect(bg).toBeInTheDocument();
    expect(bg).toHaveAttribute("aria-hidden", "true");
    expect(bg.className).toContain("print:hidden");
    expect(bg.className).toContain("fixed inset-0");
  });

  it("renders hero variant with stadium image and gradient overlays", () => {
    const { container } = render(<SiteBackground variant="hero" />);
    const bg = screen.getByTestId("site-background");
    expect(bg).toHaveAttribute("data-variant", "hero");

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.className).toContain("object-cover");
  });

  it("renders subtle variant with dimmed overlay for inner pages", () => {
    const { container } = render(<SiteBackground variant="subtle" />);
    const bg = screen.getByTestId("site-background");
    expect(bg).toHaveAttribute("data-variant", "subtle");

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  it("renders admin variant using solid background without image footprint", () => {
    const { container } = render(<SiteBackground variant="admin" />);
    const bg = screen.getByTestId("site-background");
    expect(bg).toHaveAttribute("data-variant", "admin");

    const img = container.querySelector("img");
    expect(img).toBeNull();
  });
});

