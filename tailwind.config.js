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
        // Luxe BN STORE — opera red (keeps `primary` name so admin keeps working)
        primary: {
          DEFAULT: '#7E1B22',
          light: '#A63A42',
          dark: '#5E1218',
          50: '#F9ECEC',
          100: '#F3D9D9',
          200: '#E5B3B3',
          300: '#D08A8A',
          400: '#B45A5A',
          500: '#93343A',
          600: '#7E1B22',
          700: '#671419',
          800: '#521014',
          900: '#3E0C10',
        },
        // warm ink (keeps `burgundy` name)
        burgundy: {
          50: '#2A2320',
          100: '#211B18',
          200: '#1B1512',
          300: '#14100E',
        },
        // warm paper (keeps `cream` name)
        cream: {
          DEFAULT: '#F7F1E8',
          50: '#FBF8F2',
          100: '#F7F1E8',
          200: '#EFE6D8',
        },
        gold: {
          DEFAULT: '#A4855A',
          light: '#C4A878',
          dark: '#8A6D43',
        },
        gray: {
          soft: '#E8E8E8',
          medium: '#A0A0A0',
          dark: '#4A4A4A',
        },
        paper: '#F7F1E8',
        ink: '#1B1512',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-xl': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.2' }],
        'heading-lg': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.25' }],
        'heading-md': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3' }],
        'heading-sm': ['clamp(1rem, 2vw, 1.25rem)', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'pill': '9999px',
        'card': '1rem',
        'card-lg': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(27, 21, 18, 0.07), 0 10px 20px -2px rgba(27, 21, 18, 0.04)',
        'card': '0 4px 20px -4px rgba(27, 21, 18, 0.1), 0 2px 6px -2px rgba(27, 21, 18, 0.05)',
        'card-hover': '0 10px 40px -10px rgba(27, 21, 18, 0.18), 0 4px 12px -4px rgba(27, 21, 18, 0.1)',
        'pink-glow': '0 0 30px -5px rgba(126, 27, 34, 0.35)',
        'pink-glow-hover': '0 0 40px -5px rgba(126, 27, 34, 0.5)',
      },
      transitionDuration: {
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A4855A' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
