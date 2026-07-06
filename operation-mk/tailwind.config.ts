import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080A0C",
        surface: {
          1: "#101419",
          2: "#171C22",
          3: "#20262D",
        },
        text: {
          primary: "#EDF1F4",
          secondary: "#929BA5",
          muted: "#5F6872",
        },
        signal: {
          red: "#D94141",
        },
        amber: "#D6A84B",
        cyan: "#59B8C8",
        success: "#62B985",
        divider: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "8px",
      },
      maxWidth: {
        frame: "430px",
      },
    },
  },
  plugins: [],
};

export default config;
