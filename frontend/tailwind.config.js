/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-text': '#030E12',
        'custom-bg':'#FCDE67',
        'custom-bg1': '#6B4C3B' ,                 // Add custom color to the theme
      },
    },
  },
  plugins: [],
}
