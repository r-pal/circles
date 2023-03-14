/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
    fontFamily: {
      header: ["Tilt Prism"]
    },
    colors: {
      "Dark purple": "#3A3042",
      "Earth yellow": "#DB9D47",
      "Coral": "#FF784F",
      "Peach Yellow": "#FFE19C",
      "Nyanza": "#EDFFD9",
      'white': '#ffffff',
      transparent: 'transparent',
    },
  },
  plugins: [require("daisyui")],
}
