/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
        blue: {
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
        },
        green: {
          700: '#15803D',
          600: '#16A34A',
          500: '#22C55E',
          400: '#4ADE80',
        },
        red: {
          700: '#B91C1C',
          600: '#DC2626',
          500: '#EF4444',
          400: '#F87171',
        },
        yellow: {
          700: '#A16207',
          600: '#CA8A04',
          500: '#EAB308',
          400: '#FACC15',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-once': 'pulse 0.5s ease-out',
      },
    },
  },
  plugins: [],
}