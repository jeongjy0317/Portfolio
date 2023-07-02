/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./docs/*.{html, js}", "./docs/pages/*.{html, js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

