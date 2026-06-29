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
        bg: "#F7F3EC",
        surface: "#EFEBE3",
        text: "#1A1A1A",
        muted: "#5A5A5A",
        border: "#1A1A1A",
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
      },
      spacing: {
        section: "5rem",
      },
    },
  },
  plugins: [],
};

export default config;
