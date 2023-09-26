/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        1: "1px",
      },
      spacing: {
        74: "18.5rem",
        "34/36": "94%",
      },
      minHeight: {
        smallScreen: ["100vh", "100svh"],
      },
      height: {
        smallScreen: ["100vh", "100svh"],
        smallScreenHalf: ["50vh", "50svh"],
        inherit: "inherit",
      },
      width: {
        inherit: "inherit",
      },
      transitionProperty: {
        accent: "accent-color",
      },
      colors: {
        "slate-transparent": "#1E313B77",
      },
      backgroundImage: {
        hero: "url('/images/background-hero.jpg')",
        "mobile-user": "url('/images/background-1.jpg')",
        "exercising-user": "url('/images/background-2.jpg')",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        bebasneue: ["Bebas Neue", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
