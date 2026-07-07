import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border-strong)",
        "border-soft": "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-muted": "var(--color-accent-muted)",
        "accent-soft": "var(--color-accent-soft)",
        card: "var(--color-card)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        display: ["4.5rem", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        h1: ["2.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h2: ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h3: ["1.125rem", { lineHeight: "1.3" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        meta: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      maxWidth: {
        content: "72rem",
        "content-wide": "90rem",
      },
      spacing: {
        section: "5rem",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
    },
  },
  plugins: [],
};

export default config;
