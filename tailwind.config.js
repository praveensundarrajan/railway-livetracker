/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e14',
          900: '#0d1219',
          850: '#10151d',
          800: '#141a23',
          700: '#1a212c',
          600: '#232b38',
          500: '#2f3a4a',
        },
        rail: {
          red: '#c8442c',
          redDim: '#8f3020',
        },
        ok: '#3fb27f',
        warn: '#d99a3d',
        crit: '#d64545',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
