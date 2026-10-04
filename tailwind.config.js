/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        jp: ['"Hiragino Kaku Gothic ProN"', '"Yu Gothic"', '"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        duo: {
          green: '#58cc02',
          greenDark: '#46a302',
          blue: '#1cb0f6',
          purple: '#ce82ff',
          gold: '#ffc800',
          red: '#ff4b4b',
          ink: '#3c3c3c',
        },
      },
      boxShadow: {
        btn: '0 4px 0 0 rgba(0,0,0,0.18)',
        card: '0 2px 0 0 rgba(0,0,0,0.10)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        pop: 'pop 0.2s ease-out',
        shake: 'shake 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
