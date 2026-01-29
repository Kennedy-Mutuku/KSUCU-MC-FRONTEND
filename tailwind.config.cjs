/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6c0a50',
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
            fontFamily: {
                sans: ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'button': '0 2px 8px rgba(108, 10, 80, 0.25)',
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
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'dance-1': 'dance-1 12s ease-in-out infinite',
                'dance-2': 'dance-2 12s ease-in-out infinite',
                'dance-3': 'dance-3 12s ease-in-out infinite',
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
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'dance-1': { // Integrity (Left)
                    '0%, 20%': { transform: 'translate3d(0, 0, 0)' },
                    '10%': { transform: 'translate3d(0, -15px, 0)' }, /* Float Up */
                    '30%': { transform: 'translate3d(100%, 0, 0)' }, /* Move Right */
                    '50%': { transform: 'translate3d(220%, 0, 0)' }, /* Far Right */
                    '70%': { transform: 'translate3d(110%, 0, 0) scale(0.8)', opacity: '0.5' }, /* Merge Center */
                    '85%': { transform: 'translate3d(110%, 0, 0) scale(0.1)', opacity: '0' },
                    '90%': { transform: 'translate3d(0, 0, 0) scale(0.1)', opacity: '0' },
                    '100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
                },
                'dance-2': { // Purity (Center)
                    '0%, 20%': { transform: 'translate3d(0, 0, 0)' },
                    '10%': { transform: 'translate3d(0, 15px, 0)' }, /* Float Down */
                    '30%': { transform: 'translate3d(0, 0, 0) scale(1.1)' },
                    '50%': { transform: 'translate3d(0, 0, 0) rotate(180deg)' },
                    '70%': { transform: 'translate3d(0, 0, 0) scale(0.8)', opacity: '0.5' },
                    '85%': { transform: 'translate3d(0, 0, 0) scale(0.1)', opacity: '0' },
                    '90%': { transform: 'translate3d(0, 0, 0) scale(0.1)', opacity: '0' },
                    '100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
                },
                'dance-3': { // Chastity (Right)
                    '0%, 20%': { transform: 'translate3d(0, 0, 0)' },
                    '10%': { transform: 'translate3d(0, -15px, 0)' }, /* Float Up */
                    '30%': { transform: 'translate3d(-100%, 0, 0)' }, /* Move Left */
                    '50%': { transform: 'translate3d(-220%, 0, 0)' }, /* Far Left */
                    '70%': { transform: 'translate3d(-110%, 0, 0) scale(0.8)', opacity: '0.5' }, /* Merge Center */
                    '85%': { transform: 'translate3d(-110%, 0, 0) scale(0.1)', opacity: '0' },
                    '90%': { transform: 'translate3d(0, 0, 0) scale(0.1)', opacity: '0' },
                    '100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
