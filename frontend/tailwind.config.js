/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0A0604', // Deepest Obsidian
          900: '#120B07', // Dark Espresso
          850: '#180F0A', // Warm Dark Espresso
          800: '#22150E', // Charcoal Roast
          700: '#382216', // Coffee Bean
          600: '#5C3824', // Cinnamon Bark
          amber: '#E58B20', // Radiant Saffron Amber
          gold: '#F4B245', // Gilded Gold
          terracotta: '#C85A32', // Rich Terracotta
          cream: '#FDF8F0', // Soft Ivory
          parchment: '#EFE7DB', // Muted Parchment
          muted: '#9E8E81', // Warm Muted Taupe
          border: 'rgba(229, 139, 32, 0.18)',
          card: 'rgba(24, 15, 10, 0.72)',
        }
      },
      fontFamily: {
        serif: ['"Tan Mon Cheri"', '"TAN - MON CHÉRI"', '"Italiana"', '"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        moncheri: ['"Tan Mon Cheri"', '"TAN - MON CHÉRI"', '"Italiana"', '"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        display: ['"Tan Mon Cheri"', '"TAN - MON CHÉRI"', '"Italiana"', '"Cormorant Garamond"', '"Outfit"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-radial': 'radial-gradient(circle at 50% 50%, rgba(229, 139, 32, 0.15) 0%, rgba(10, 6, 4, 0) 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'amber-gradient': 'linear-gradient(135deg, #F4B245 0%, #E58B20 50%, #C85A32 100%)',
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(229, 139, 32, 0.45)',
        'glow-gold': '0 0 35px -5px rgba(244, 178, 69, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(229, 139, 32, 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0' },
          '50%': { transform: 'translateY(-20px) scaleX(1.2)', opacity: '0.7' },
          '100%': { transform: 'translateY(-40px) scaleX(1.5)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        steam: 'steam 3s ease-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      }
    },
  },
  plugins: [],
}
