/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
          100: '#fffbe0',
          200: '#fff3b0',
          300: '#ffe880',
          400: '#ffd700',
          500: '#f5c518',
          600: '#d4a017',
          700: '#a07010',
          800: '#7a5208',
          900: '#5c3d05',
        },
        ivory: '#fffff0',
        champagne: '#f7e7ce',
        maroon: { DEFAULT: '#800020', light: '#a0002a', dark: '#5c0018' },
        emerald: { DEFAULT: '#006400', light: '#008000', dark: '#004d00' },
        palace: { bg: '#0a0505', dark: '#1a0a0a', mid: '#2a1010' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"EB Garamond"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        tamil: ['"Noto Serif Tamil"', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
        'petal-fall': 'petalFall 8s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        glow: { from: { textShadow: '0 0 10px #ffd700, 0 0 20px #ffd700' }, to: { textShadow: '0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 60px #d4a017' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        petalFall: { '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: 1 }, '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: 0 } },
      },
    },
  },
  plugins: [],
}
