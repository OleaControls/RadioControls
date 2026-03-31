/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': {
          DEFAULT: '#002366',
          dark: '#001a4d',
          light: '#003399',
        },
        neon: {
          cyan: '#00f3ff',
          purple: '#bc13fe',
          green: '#39ff14',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}