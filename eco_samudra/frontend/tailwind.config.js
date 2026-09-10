/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        maritime: {
          dark: '#071527',
          card: '#0f2b48',
          border: '#1e406b',
          accent: '#00d2d3',
          emerald: '#10b981',
          amber: '#f59e0b',
          lightBg: '#f0f4f8',
          lightCard: '#ffffff',
          lightBorder: '#cbd5e1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'wave-slow': 'wave 8s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
