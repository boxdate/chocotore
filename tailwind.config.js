/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './constants.ts',
    './components/**/*.{ts,tsx}',
    './views/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        choco: {
          50: '#fbf5ee',
          100: '#f5e6d3',
          200: '#ebd4b3',
          300: '#dcb888',
          400: '#cc9658',
          500: '#b47634',
          600: '#915823',
          700: '#73431d',
          800: '#5e361b',
          900: '#4d2d18',
        },
        cream: '#fdf6e3',
      },
      fontFamily: {
        sans: ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
