import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hpl: {
          deep: "var(--bg-deep)",
          surface: "var(--bg-surface)",
          "surface-2": "var(--bg-surface-2)",
          border: "var(--border)",
          accent: "var(--accent)",
          "accent-soft": "var(--accent-soft)",
          gold: "var(--gold)",
          text: "var(--text)",
          muted: "var(--text-muted)",
          live: "var(--live)",
          success: "var(--success)",

          // Compatibility aliases
          dark: "var(--bg-deep)",
          header: "var(--bg-surface)",
          nav: "var(--bg-surface)",
          heroStart: "var(--bg-deep)",
          heroMid: "var(--bg-surface)",
          heroEnd: "var(--bg-deep)",
          primary: "var(--accent)",
          primaryLight: "var(--accent-soft)",
          card: "var(--bg-surface)",
          cardLavender: "var(--bg-surface-2)",
          cardLavenderBorder: "var(--border)",
          lavenderSubtle: "var(--bg-surface-2)",
          textDark: "var(--text)",
          liveRed: "var(--live)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Bebas Neue", "Anton", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(5, 13, 23, 0.4), 0 1px 3px rgba(5, 13, 23, 0.6)",
        card: "0 4px 20px -2px rgba(5, 13, 23, 0.7), 0 2px 6px -1px rgba(23, 56, 77, 0.2)",
        glow: "0 0 25px rgba(56, 182, 255, 0.25)",
      },
      animation: {
        pulseFast: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
