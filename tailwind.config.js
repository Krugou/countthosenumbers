/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Roboto', 'sans-serif'],
      },
      colors: {
        // Main brand colors
        'main-orange': {
          '50': '#fff7ed',
          '100': '#ffedd5',
          '200': '#fed7aa',
          '300': '#fdba74',
          '400': '#fb923c',
          '500': '#f97316',
          '600': '#ea580c',
          '700': '#c2410c',
          '800': '#9a3412',
          '900': '#7c2d12',
          '950': '#431407',
        },
        // Support colors for system feedback
        'support': {
          'success': '#4ade80',
          'warning': '#facc15',
          'error': '#f43f5e',
          'info': '#38bdf8',
        },
        // Trend colors for visual hierarchy
        'trend': {
          'primary': '#3b82f6',
          'secondary': '#8b5cf6',
          'tertiary': '#ec4899',
        },
      },
    },
  },
  plugins: [],
}