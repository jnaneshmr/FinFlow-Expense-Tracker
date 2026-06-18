/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#6c63ff',
          light: '#8b85ff',
          dark: '#5048cc',
        },
        surface: {
          DEFAULT: '#13161d',
          secondary: '#1a1e28',
          tertiary: '#222736',
        },
      },
      borderRadius: {
        card: '16px',
      },
      animation: {
        'slide-up': 'slideUp 0.2s ease',
        'fade-in': 'fadeIn 0.15s ease',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
