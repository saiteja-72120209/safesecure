/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Heron AI Monochromatic Architectural Palette:
        ivory: '#F5F4EF',       // warm ivory background
        charcoal: '#252525',    // primary text, borders, dark accents
        lightgray: '#D7D7D2',   // subtle grid lines, dividers, card strokes
        midgray: '#A7A7A1',     // annotations, secondary labels
        muted: '#777771',       // body text, secondary captions
        signal: '#FF3218',      // signal orange-red accent for CTA & key focus
        white: '#FFFFFF',

        // Legacy compatibility mappings
        offwhite: '#F5F4EF',
        softgray: '#D7D7D2',
        cream: '#F5F4EF',

        // Restrained status colors
        sec: {
          red: '#FF3218',
          redBg: 'rgba(255, 50, 24, 0.08)',
          amber: '#C88D28',
          amberBg: 'rgba(200, 141, 40, 0.08)',
          green: '#2A8F5D',
          greenBg: 'rgba(42, 143, 93, 0.08)',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(37, 37, 37, 0.04)',
        'card': '0 2px 10px rgba(37, 37, 37, 0.03)',
        'elevated': '0 10px 30px rgba(37, 37, 37, 0.06)',
        'glow-signal': '0 0 20px rgba(255, 50, 24, 0.25)',
      }
    },
  },
  plugins: [],
}
