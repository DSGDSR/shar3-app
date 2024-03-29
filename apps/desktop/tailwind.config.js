const path = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    path.join(__dirname, './index.html'),
    path.join(__dirname, './src/**/*.{js,ts,jsx,tsx,html,astro}'),
    path.join(__dirname, 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}')
  ],
  theme: {
    extend: {
      screens: {
        'xs': '500px',
      },
      colors: {
        primary: '#7f5af0',
        primaryHover: '#6546c3',
        secondary: '#72757e',
        secondaryHover: '#52545c'
      }
    }
  },
  plugins: [],
}

