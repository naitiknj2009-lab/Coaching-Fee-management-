/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0c1a30',
        },
        midnight: {
          800: '#15243e',
          900: '#0c1a30',
          950: '#070d18',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'executive': '0 4px 20px -2px rgba(12, 26, 48, 0.08), 0 2px 6px -1px rgba(12, 26, 48, 0.04)',
        'executive-lg': '0 12px 32px -4px rgba(12, 26, 48, 0.12), 0 4px 12px -2px rgba(12, 26, 48, 0.06)',
      }
    },
  },
  plugins: [],
}
