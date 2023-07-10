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
        mobileScreen: ["100vh", "100svh"],
        mobileScreenHalf: ["50vh", "50svh"],
      },
      height: {
        mobileScreen: ["100vh", "100svh"],
        mobileScreenHalf: ["50vh", "50svh"],
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
        montserrat: ["Montserrat", "sans-serif"],
        bebasneue: ["Bebas Neue", "sans-serif"],
      }
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
