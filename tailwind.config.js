/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    fontFamily: {
      mono: ["IBM Plex Mono", "sans-serif"],
      head: ["Poppins Bold", "sans-serif"],
      body: ["Poppins Light", "sans-serif"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")({ className: "prose" })],
};
