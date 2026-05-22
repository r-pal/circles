/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--theme-canvas)",
        surface: "var(--theme-surface)",
        foreground: "var(--theme-foreground)",
        "on-canvas": "var(--theme-on-canvas)",
        accent: "var(--theme-accent)",
        "btn-fill": "var(--theme-button-bg)",
        "btn-text": "var(--theme-button-text)",
        purple: "#3A3042",
        tangerine: "#DB9D47",
        coral: "#FF784F",
        sea: "#315964",
        nyanza: "#EDFFD9",
        white: "#ffffff",
        transparent: "transparent",
      },
      fontFamily: {
        sans: ['"Tilt Prism"', "ui-sans-serif", "system-ui", "sans-serif"],
        header: ['"Tilt Prism"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
