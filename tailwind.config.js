/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{jsx,tsx,svelte}"],
  theme: {
    extend: {
      colors: {
        hl: "rgb(var(--color-hl-frag) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}
