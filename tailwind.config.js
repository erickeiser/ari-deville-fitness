/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        astros: {
          navy: '#002D62',
          orange: '#F4871E',
          'orange-dark': '#EB6E1F',
          white: '#ffffff',
        }
      }
    },
  },
  plugins: [],
};