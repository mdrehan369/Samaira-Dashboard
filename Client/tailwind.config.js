/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        appear: {
          "from": {
            opacity: 0,
            transform: "translateY(10px)"
          },
          "to": {
            opacity: 1,
            transform: "translateY(0px)"
          }
        },
      },
      animation: {
        'animate-appear': 'appear 0.5s ease-in-out'
      }
    },
  },
  plugins: [],
}