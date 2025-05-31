import { type Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced status colors
        active: {
          DEFAULT: '#10B981',  // emerald-600
          pulse: 'rgba(16, 185, 129, 0.3)' // glow color
        },
        inactive: {
          DEFAULT: '#EF4444',  // red-500
          dark: '#DC2626'      // red-600
        }
      },
      animation: {
        wave: 'wave 1.3s ease-in-out infinite',
        'pulse-status': 'pulse-status 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 4s ease-in-out infinite',
        bounce: 'bounce 1.3s ease-in-out infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(5deg)' },
          '50%': { transform: 'translateY(0) rotate(0deg)' },
          '75%': { transform: 'translateY(-5px) rotate(-5deg)' },
        },
        'pulse-status': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)'
          },
          '70%': { 
            opacity: '0.95',
            boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [animate],
};

export default config;