"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import stadiumBg from "../../assets/hpl-stadium-bg.jpg";

export type SiteBackgroundVariant = "hero" | "subtle" | "admin";

export interface SiteBackgroundProps {
  variant?: SiteBackgroundVariant;
  className?: string;
}

export const SiteBackground: React.FC<SiteBackgroundProps> = ({
  variant: propVariant,
  className = "",
}) => {
  const pathname = usePathname();

  // Resolve variant: explicit prop wins, otherwise derive from current route
  const resolvedVariant: SiteBackgroundVariant = React.useMemo(() => {
    if (propVariant) return propVariant;
    if (pathname?.startsWith("/admin")) return "admin";
    if (pathname === "/") return "hero";
    return "subtle";
  }, [propVariant, pathname]);

  // Admin route optimization: avoid image loading/decoding entirely; use solid deep navy + light ambient glow
  if (resolvedVariant === "admin") {
    return (
      <div
        className={`fixed inset-0 -z-10 pointer-events-none select-none bg-hpl-deep print:hidden ${className}`}
        aria-hidden="true"
        data-testid="site-background"
        data-variant="admin"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,182,255,0.05),rgba(5,13,23,1))]" />
      </div>
    );
  }

  const isHero = resolvedVariant === "hero";

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden bg-hpl-deep print:hidden ${className}`}
      aria-hidden="true"
      data-testid="site-background"
      data-variant={resolvedVariant}
    >
      {/* Stadium floodlight & athlete silhouettes image */}
      <Image
        src={stadiumBg}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={80}
        className="object-cover object-top sm:object-[center_top] select-none"
      />

      {/* Layer 1: Vertical gradient overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isHero
            ? "bg-gradient-to-b from-[#050d17]/35 via-[#050d17]/60 to-[#050d17]/85"
            : "bg-gradient-to-b from-[#050d17]/70 via-[#050d17]/88 to-[#050d17]/95"
        }`}
      />

      {/* Layer 2: Center radial vignette so content sits on a calm dark area */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isHero
            ? "bg-[radial-gradient(circle_at_50%_45%,rgba(5,13,23,0.55)_0%,rgba(5,13,23,0.85)_100%)]"
            : "bg-[radial-gradient(circle_at_50%_45%,rgba(5,13,23,0.75)_0%,rgba(5,13,23,0.95)_100%)]"
        }`}
      />

      {/* Layer 3: Extra subtle dimming for inner pages to keep scoreboards & tables ultra-legible */}
      {!isHero && (
        <div className="absolute inset-0 bg-[#050d17]/40 backdrop-blur-[0.5px]" />
      )}
    </div>
  );
};

