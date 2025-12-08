/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Void & Aether" Theme (Black & Purple)
        space: {
          950: '#000000', // Pure Black Void
          900: '#05040a', // Almost Black
          800: '#0f0a19', // Dark Purple-Black Panel
          700: '#1d1530', // Lighter Border
          600: '#342a4d', // Muted Text
          400: '#9ca3af', // Light Gray
        },
        // Neon Purple Accents replaces "Holo"
        holo: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc', // Bright Purple
          500: '#a855f7', // Primary Purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Secondary Accents
        accent: {
          pink: '#f472b6',
          cyan: '#22d3ee',
        },
        // Status Indicators
        alert: {
          DEFAULT: '#ef4444', 
          dim: '#450a0a',
        },
        warn: {
          DEFAULT: '#f59e0b',
          dim: '#451a03',
        },
        success: {
          DEFAULT: '#10b981',
          dim: '#064e3b',
        }
      },
      fontFamily: {
        sans: ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1d1530 1px, transparent 1px), linear-gradient(to bottom, #1d1530 1px, transparent 1px)",
        'hub-glow': 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        'void-gradient': 'linear-gradient(to bottom right, #000000, #0f0a19)',
      },
      animation: {
        'scanline': 'scanline 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5, boxShadow: '0 0 10px #a855f7' },
          '50%': { opacity: 1, boxShadow: '0 0 25px #c084fc' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
