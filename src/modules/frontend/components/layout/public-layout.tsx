import React from "react";
import { PublicNavbar } from "./public-navbar";
import { PublicFooter } from "./public-footer";
import { SiteBackground } from "./site-background";

export interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-hpl-text relative">
      <SiteBackground />
      <PublicNavbar />
      <main className="flex-1 w-full">{children}</main>
      <PublicFooter />
    </div>
  );
};
