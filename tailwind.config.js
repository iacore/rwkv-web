/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{jsx,tsx,svelte}"],
  theme: {
    fontFamily: {
      sans: [
        '"Recursive", "Nono Sans CJK", "Nono Sans CJK SC", "Nono Sans CJK TC", sans-serif',
      ],
      mono: [
        '"Recursive", "Nono Sans CJK", "Nono Sans CJK SC", "Nono Sans CJK TC", sans-serif',
        {
          fontVariationSettings: '"MONO" 1',
        },
      ],
    },
    extend: {
      colors: {
        hl: "rgb(var(--color-hl-frag) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}
