import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F3D73",   // bleu foncé du logo / header
          blue: "#1B5FA8",   // bleu principal (boutons, titres)
          orange: "#F5A623", // orange accent (CTA, badges)
          orangeDark: "#E08E0B",
          slate: "#475569",
          line: "#E4E7EC",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      spacing: {
        4.5: "1.125rem", // utilisé pour les icônes de taille intermédiaire (w-4.5/h-4.5)
      },
    },
  },
  plugins: [],
};
export default config;
