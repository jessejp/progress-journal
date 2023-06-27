/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        smallScreen: ["100vh", "100svh"],
      },
      maxHeight: {
        128: "32rem",
        192: "48rem",
      },
      minHeight: {
        20: "5rem",
      },
      transitionProperty: {
        accent: "accent-color",
      }
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
