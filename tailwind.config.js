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
        casinoBlack: '#0D0D0D',
        casinoBlack2: '#1A1A1A',
        casinoBlack3: '#252525',
        casinoGreen: '#0DB15D',
        casinoGreenDark: '#0D6A2B',
        casinoGold: '#F5C242',
        casinoRed: '#FF314A',
        casinoBlue: '#2D9CFF',
        textPrimary: '#FFFFFF',
        textSecondary: '#C7C7C7',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(245, 194, 66, 0.5)',
        'glow-green': '0 0 20px rgba(13, 177, 93, 0.5)',
        'glow-blue': '0 0 20px rgba(45, 156, 255, 0.5)',
        'glow-red': '0 0 20px rgba(255, 49, 74, 0.5)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-casino': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)',
        'gradient-casino-reverse': 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F5C242 0%, #D4A533 100%)',
        'gradient-green': 'linear-gradient(135deg, #0DB15D 0%, #0D6A2B 100%)',
      },
    },
  },
  plugins: [],
}
