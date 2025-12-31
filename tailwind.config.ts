import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        yeseva: ['Yeseva One', 'serif'],
        unbounded: ['Unbounded', 'sans-serif'],
      },
      colors: {
        // Paleta Bora Bora
        'bora-yellow': '#FCB235',
        'bora-brown': '#462F13',
        'bora-red': '#EF432E',
        'bora-orange-dark': '#D04D38',
        'bora-orange': '#F68B31',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-fire': 'linear-gradient(135deg, #EF432E 0%, #F68B31 50%, #FCB235 100%)',
      },
    },
  },
  plugins: [],
}
export default config
