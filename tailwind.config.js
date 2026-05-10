/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // teal-500
        secondary: "#3b82f6", // blue-500
        dark: "#0f172a", // slate-900
        light: "#f8fafc", // slate-50
      }
    },
  },
  plugins: [],
}
