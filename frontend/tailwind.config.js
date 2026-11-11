/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f4',
          100: '#d9ede5',
          200: '#b3dccb',
          300: '#7ec2a7',
          400: '#4ba282',
          500: '#285C4A',
          600: '#173F35',
          700: '#112e26',
          800: '#0c2019',
          900: '#081610',
        },
        lime: {
          brand: '#B8D986',
          light: '#d4ebb0',
          dark: '#8fb55e',
        },
        offwhite: '#F8F9F5',
        charcoal: '#252B28',
        muted:   '#89928C',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':     '0 2px 12px 0 rgba(23,63,53,0.07)',
        'card-hover': '0 8px 32px 0 rgba(23,63,53,0.13)',
        'nav':      '0 1px 0 0 rgba(23,63,53,0.08)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      screens: {
        'xs': '480px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #173F35 0%, #285C4A 100%)',
      },
    },
  },
  plugins: [],
}
