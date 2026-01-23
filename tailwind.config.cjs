/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F9F5F7',
          100: '#F0E6EB',
          200: '#E1CCD7',
          300: '#C9A3B5',
          400: '#A87A91',
          500: '#6B4C5A',
          600: '#5A3F4C',
          700: '#49333E',
          800: '#382730',
          900: '#271B22',
          DEFAULT: '#6B4C5A'
        },
        secondary: {
          50: '#F0F7F9',
          100: '#D9EDF2',
          200: '#B3DBE5',
          300: '#8DC9D8',
          400: '#67B7CB',
          500: '#4A90A4',
          600: '#3D7688',
          700: '#305C6C',
          800: '#234250',
          900: '#162834',
          DEFAULT: '#4A90A4'
        },
        surface: '#FFFFFF',
        background: '#FAFAFA',
        border: '#E2E8F0',
        'text-primary': '#2D3748',
        'text-secondary': '#718096',
        'text-muted': '#A0AEC0',
      },
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'toast': '600',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'button': '0 2px 8px rgba(107, 76, 90, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
