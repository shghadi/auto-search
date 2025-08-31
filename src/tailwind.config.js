/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5", // Indigo-600
          dark: "#3730A3", // Indigo-800
          light: "#6366F1", // Indigo-500
        },
        secondary: {
          DEFAULT: "#F59E0B", // Amber-500
          dark: "#B45309", // Amber-700
          light: "#FBBF24", // Amber-400
        },
        neutral: {
          light: "#F3F4F6", // Gray-100
          DEFAULT: "#9CA3AF", // Gray-400
          dark: "#111827", // Gray-900
        },
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "Arial", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
