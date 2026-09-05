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
        brand: {
          green: "#00B050",
          hover: "#009243",
          dark: "#1A2E20",
          heading: "#0F1F14",
          body: "#1E293B",
          mint: "#F8FAF7",
          lightMint: "#EAF5EE",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 176, 80, 0.08)",
        card: "0 4px 20px -2px rgba(15, 31, 20, 0.06)",
        cardHover: "0 12px 30px -4px rgba(0, 176, 80, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
