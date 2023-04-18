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
    extend: {},
  },
  plugins: [],
}

