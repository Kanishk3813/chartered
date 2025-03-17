/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#6366F1',
            50: '#EEEDFF',
            100: '#D8D9FF',
            200: '#B0B1FE',
            300: '#8A8BFC',
            400: '#6366F1',
            500: '#4F46E5',
            600: '#3F38CC',
            700: '#312CA6',
            800: '#24207F',
            900: '#181559',
          },
          dark: {
            DEFAULT: '#121212',
            50: '#2D2D2D',
            100: '#252525',
            200: '#1F1F1F',
            300: '#181818',
            400: '#121212',
            500: '#0E0E0E',
            600: '#0A0A0A',
            700: '#060606',
            800: '#030303',
            900: '#000000',
          },
          light: {
            DEFAULT: '#F9FAFB',
            50: '#FFFFFF',
            100: '#F9FAFB',
            200: '#E2E5EB',
            300: '#CBD1DC',
            400: '#B4BDCC',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        boxShadow: {
          card: '0 4px 15px rgba(0, 0, 0, 0.1)',
          'card-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
          'card-dark': '0 4px 15px rgba(0, 0, 0, 0.3)',
          'card-dark-hover': '0 8px 25px rgba(0, 0, 0, 0.45)',
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'gradient': 'gradient 8s ease infinite',
          'fade-in': 'fadeIn 0.5s ease-out',
        },
        keyframes: {
          gradient: {
            '0%, 100%': {
              'background-position': '0% 50%'
            },
            '50%': {
              'background-position': '100% 50%'
            },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },
      },
    },
    plugins: [require('@tailwindcss/forms')],
  }