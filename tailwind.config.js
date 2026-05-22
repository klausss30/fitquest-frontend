/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#080809',
        surface: 'rgba(255,255,255,0.045)',
        gold: {
          DEFAULT: '#C8A96E',
          dim: 'rgba(200,169,110,0.12)',
          border: 'rgba(200,169,110,0.3)',
          glow: 'rgba(200,169,110,0.25)',
        },
        stone: {
          50:  '#F0EBE3',
          200: '#C4BDB4',
          400: '#7A7268',
          600: '#48443F',
          800: '#1C1A18',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        'float-sm': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
        'spin-ring': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'gold-pulse': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(200,169,110,0.2)' },
          '50%':       { boxShadow: '0 0 48px rgba(200,169,110,0.45)' },
        },
      },
      animation: {
        float:        'float 4.5s ease-in-out infinite',
        'float-sm':   'float-sm 3.8s ease-in-out infinite',
        'spin-ring':  'spin-ring 1.2s linear infinite',
        'fade-up':    'fade-up 0.45s ease-out forwards',
        'scale-in':   'scale-in 0.35s ease-out forwards',
        'gold-pulse': 'gold-pulse 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
