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
          // Values come from CSS variables so they can be changed in the dashboard (theme).
          green: "rgb(var(--brand-green) / <alpha-value>)",
          hover: "rgb(var(--brand-hover) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)",
          heading: "rgb(var(--brand-heading) / <alpha-value>)",
          body: "rgb(var(--brand-body) / <alpha-value>)",
          mint: "rgb(var(--brand-mint) / <alpha-value>)",
          lightMint: "rgb(var(--brand-light-mint) / <alpha-value>)",
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
