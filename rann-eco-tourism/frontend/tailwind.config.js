/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f5ddb2",
          300: "#edc67c",
          400: "#e4a84a",
          500: "#dc8f28",
          600: "#c4731d",
          700: "#a25519",
          800: "#84421b",
          900: "#6c3619",
        },
        rann: {
          blue:   "#1e6b8a",
          teal:   "#2a9d8f",
          rust:   "#e76f51",
          earth:  "#8b6f47",
          sky:    "#a8dadc",
          white:  "#f1faee",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        gujarati: ["Noto Sans Gujarati", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(8px)", opacity: "0" },
          to:   { transform: "translateY(0)",   opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
