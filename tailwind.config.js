/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 11.9% 95.7%)',
        accent: 'hsl(12 93.8% 53.1%)',
        primary: 'hsl(220 89.3% 50%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(220 14% 14%)',
        'text-secondary': 'hsl(220 14% 44%)',
        dark: {
          bg: 'hsl(220 14% 8%)',
          surface: 'hsl(220 14% 12%)',
          'surface-light': 'hsl(220 14% 16%)',
          text: 'hsl(220 14% 95%)',
          'text-secondary': 'hsl(220 14% 70%)',
        }
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 14%, 14%, 0.08)',
        'focus': '0 0 0 3px hsl(12, 93.8%, 53.1%)',
        'dark-card': '0 4px 12px hsla(220, 14%, 4%, 0.3)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}