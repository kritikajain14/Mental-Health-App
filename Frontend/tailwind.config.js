/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#070707',
        gray: {
          900: '#1a1a1a',
          800: '#2d2d2d',
          700: '#404040',
          400: '#a3a3a3',
          300: '#d4d4d4',
        },
        pink: {
          500: '#FF5DA2',
          600: '#e04d8c',
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
      }
    },
  },
  plugins: [],
}