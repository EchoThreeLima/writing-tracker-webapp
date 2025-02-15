/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeOut': 'fadeOut 1.5s ease-in-out forwards',
        'success': 'success 0.3s ease-in-out',
        'success-message': 'successMessage 0.5s ease-in-out forwards',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', visibility: 'hidden' },
        },
        success: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '1' },
        },
        successMessage: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 