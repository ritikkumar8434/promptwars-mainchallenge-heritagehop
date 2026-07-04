import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8ed',
          100: '#ffefd1',
          200: '#ffdb9e',
          300: '#ffc06b',
          400: '#ff9f3c',
          500: '#fb7c1e',
          600: '#ec5d0e',
          700: '#c4440d',
          800: '#9c3512',
          900: '#7e2d12',
        },
        heritage: {
          50: '#fdf3f5',
          100: '#fbe3e8',
          200: '#f6c7d3',
          300: '#eea0b5',
          400: '#e26f91',
          500: '#cf4770',
          600: '#a92c56',
          700: '#8b2148',
          800: '#751e40',
          900: '#651c3b',
        },
        teal: {
          50: '#effcf9',
          100: '#c8f6ec',
          200: '#92ecda',
          300: '#57d8c1',
          400: '#2abda6',
          500: '#149e8b',
          600: '#0d7e71',
          700: '#0e655c',
          800: '#10514b',
          900: '#0f4440',
        },
      },
      fontFamily: {
        display: ['ui-serif', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
