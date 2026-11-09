import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { ServicesProvider, AuthViewProvider } from "../modules/frontend/providers";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hostel Premier League (HPL) 2026 | Live Scoring & Tournament Platform",
  description: "Official real-time multi-sport tournament and live scoring platform for the Hostel Premier League.",
  icons: {
    icon: "/hpl-logo.png",
    shortcut: "/hpl-logo.png",
    apple: "/hpl-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen font-sans bg-hpl-deep text-hpl-text selection:bg-hpl-accent/30 selection:text-white">
        <ServicesProvider>
          <AuthViewProvider>{children}</AuthViewProvider>
        </ServicesProvider>
      </body>
    </html>
  );
}
