/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'yellow': '#FCB235',
        'dark-brown': '#462F13',
        'vibrant-red': '#EF432E',
        'brick-red': '#D04D38',
        'warm-orange': '#F68B31',
        'black': '#000000',
        'white': '#FFFFFF',
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        'yeseva': ['Yeseva One', 'serif'],
        'unbounded': ['Unbounded', 'sans-serif'],
      },
      backgroundImage: {
        'tropical-pattern': "url('/images/tropical-pattern.png')",
        'gradient-tropical': 'linear-gradient(135deg, #462F13 0%, #000000 100%)',
        'gradient-fire': 'linear-gradient(90deg, #F68B31, #EF432E)',
      },
      boxShadow: {
        'fire': '0 4px 15px rgba(239, 67, 46, 0.3)',
        'fire-hover': '0 10px 25px rgba(239, 67, 46, 0.5)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
