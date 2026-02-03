/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        primary: '#d4af37',
        'primary-hover': '#b5952f',
      }
    },
  },
  plugins: [],
}
