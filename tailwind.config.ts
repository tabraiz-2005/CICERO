import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maison: {
          ivory: '#FDFBF7',
          surface: '#FAF7F2',
          'warm-white': '#F5F2EC',
          stone: '#E5E0D8',
          'stone-dark': '#C8C2B7',
          parchment: '#D6CFBF',
          taupe: '#8C8275',
          'taupe-light': '#B3ABA0',
          charcoal: '#3A3632',
          espresso: '#221E1B',
          obsidian: '#0F0E0D',
          gold: '#C5A059',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        'display-lg': ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'heading-lg': ['clamp(1.25rem, 2vw, 1.875rem)', { lineHeight: '1.25', letterSpacing: '0em' }],
        'heading-md': ['clamp(1.1rem, 1.5vw, 1.375rem)', { lineHeight: '1.35', letterSpacing: '0.01em' }],
        'subheading': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
        'subheading-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.18em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '36': '9rem',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(15, 14, 13, 0.07)',
        'luxury-hover': '0 30px 60px -20px rgba(15, 14, 13, 0.12)',
        'drawer': '-10px 0 40px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slow-zoom': 'slowZoom 20s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
