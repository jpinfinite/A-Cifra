import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Simplificado e mais abrangente
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Cores da marca organizadas como primary
        primary: {
          900: '#041924', // dark-blue
          800: '#00283B', // medium-blue
          600: '#155C8B', // primary-blue
          DEFAULT: '#155C8B',
        },
        accent: {
          DEFAULT: '#E1A441', // gold
          light: '#F5B041',
        },
        light: '#F5F7FA', // off-white
        // Mantém compatibilidade com código existente
        brand: {
          'dark-blue': '#041924',
          'medium-blue': '#00283B',
          'primary-blue': '#155C8B',
          'off-white': '#F5F7FA',
          'gold': '#E1A441',
          // Cores otimizadas para contraste (WCAG AAA)
          'link': '#0A2F4A', // Ratio 8:1 - Links
          'link-hover': '#051A2E', // Ratio 10:1 - Links hover
          'text-high-contrast': '#0D3D5C', // Ratio 7:1 - Textos importantes
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'var(--font-inter)', 'sans-serif']
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      // Animações customizadas
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(21, 92, 139, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 20px 10px rgba(21, 92, 139, 0.6)' 
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)'
          },
          '70%': {
            transform: 'scale(0.9)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'bounce-in': 'bounce-in 0.8s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config