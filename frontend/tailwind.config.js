/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: "#050508",
          800: "#0a0a12",
          700: "#0f0f1a",
          600: "#14142a",
        },
        volt: {
          DEFAULT: "#b5ff2d",
          dark:    "#8acc1a",
          glow:    "#d4ff6e",
        },
        plasma: {
          DEFAULT: "#ff3de8",
          dark:    "#cc1fbb",
          glow:    "#ff80f0",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        mono:    ["'JetBrains Mono'", "monospace"],
        body:    ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};