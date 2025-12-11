import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        casinoBg: '#050816',
        casinoSurface: '#0B1020',
        casinoSurfaceAlt: '#11172A',
        casinoOrange: '#FF9F1C',
        casinoOrangeLight: '#FFB547',
        casinoPurple: '#7B61FF',
        casinoGreen: '#0DB15D',
        casinoRed: '#FF314A',
        casinoBlue: '#00C9FF',
        casinoGold: '#FFD700',
        casinoBlack: '#000000',
        casinoBlack2: '#0B0B0F',
        casinoBlack3: '#1A1A24',
        textPrimary: '#FFFFFF',
        textSecondary: '#9BA4C4',
      },
      boxShadow: {
        card: '0 8px 20px rgba(0,0,0,0.45)',
        'card-dark': '0 10px 30px rgba(0,0,0,0.6)',
        soft: '0 4px 10px rgba(0,0,0,0.25)',
        glow: '0 0 20px rgba(255,159,28,0.5)',
        'glow-gold': '0 0 25px rgba(255,215,0,0.4)',
        'glow-green': '0 0 25px rgba(13,177,93,0.4)',
        'glow-purple': '0 0 25px rgba(123,97,255,0.4)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-casino': 'linear-gradient(to bottom, #050816, #0B1020)',
        'gradient-casino-reverse': 'linear-gradient(to bottom, #0B1020, #11172A)',
        'gradient-orange': 'linear-gradient(to bottom, #FFB547, #FF9F1C)',
        'gradient-purple': 'linear-gradient(to bottom right, #7B61FF, #FF9F1C)',
        'gradient-green': 'linear-gradient(to bottom, #0DB15D, #0A8F4A)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
