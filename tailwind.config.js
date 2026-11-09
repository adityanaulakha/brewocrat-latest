/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries(['ink','cask','oak','malt','brass','amber','honey','foam','copper','cta']
        .map((k) => [k, `rgb(var(--c-${k}) / <alpha-value>)`])),
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
