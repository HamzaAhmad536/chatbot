/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        blush: '#F9C6D3',
        pink: '#F48FB1',
        rose: '#F06292',
        lavender: '#B39DDB',
        peach: '#FFD1B3',
        gold: '#FFD700',
        purple: '#8E24AA',
        dark: '#3A2C3A',
        light: '#FFF8FA',
      },
      fontFamily: {
        sans: ["Poppins", "Quicksand", "Montserrat", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
} 