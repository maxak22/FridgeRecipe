/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral base with a green (fresh/food) + orange (warmth/appetite) accent pair,
        // per the "white with green/orange accents" design direction.
        brand: {
          50: "#f0fdf5",
          100: "#dcfce9",
          200: "#b8f5d2",
          300: "#84e9b4",
          400: "#4ad68e",
          500: "#22b573",
          600: "#16915c",
          700: "#14734b",
          800: "#145c3e",
          900: "#124c34",
        },
        accent: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc071",
          400: "#ff9d38",
          500: "#fd7e14",
          600: "#ee6108",
          700: "#c54809",
          800: "#9c390f",
          900: "#7e3010",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.08)",
        glow: "0 0 0 1px rgb(34 181 115 / 0.15), 0 8px 24px -8px rgb(34 181 115 / 0.35)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.7) translateY(4px)" },
          "70%": { opacity: 1, transform: "scale(1.05) translateY(0)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
        "celebrate-in": {
          "0%": { opacity: 0, transform: "scale(0.9) translateY(-4px)" },
          "60%": { opacity: 1, transform: "scale(1.02) translateY(0)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
        "pop-in": "pop-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
        "celebrate-in": "celebrate-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
      },
    },
  },
  plugins: [],
};
