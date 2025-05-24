/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        green: {
          dark: "#24824A",
          light: "#71BF44",
        },
        white: "#FFFFFF",
        black: "#141E28",
        yellow: {
          DEFAULT: "#FADD4A",
        },
        primary: {
          DEFAULT: "#24824A",
          light: "#71BF44",
        },
        secondary: {
          DEFAULT: "#FADD4A",
        },
      },
    },
  },
  plugins: [],
};
