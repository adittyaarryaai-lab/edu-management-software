/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Day 77: Enabling class-based dark mode for our ThemeContext
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Aapki pasand ka Void Black (#0B0F14)
        void: '#0B0F14',
        // Aapki pasand ka Neon Cyan (#3DF2E0)
        neon: '#3DF2E0',
        // Ek dark gray shades bhi add kar dete hain subtle borders ke liye
        voidLight: '#161B22',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}