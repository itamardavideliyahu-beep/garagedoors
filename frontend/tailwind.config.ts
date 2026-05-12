import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors use CSS variables so each area build can swap theme
        // by loading a different theme-*.css file. Values are raw R G B
        // triplets so Tailwind's opacity modifier (<alpha-value>) works.
        brand: {
          50:  'rgb(var(--brand-50)  / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
          950: 'rgb(var(--brand-950) / <alpha-value>)',
        },
        ink: {
          50:  '#f5f7fa',
          100: '#e9eef5',
          200: '#cfd8e3',
          300: '#a5b5c8',
          400: '#748aa3',
          500: '#536d89',
          600: '#3f5570',
          700: '#34465b',
          800: '#2e3c4d',
          900: '#1c2532',
          950: '#0f1620',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(15, 22, 32, 0.15)',
        glow: '0 0 0 6px rgb(var(--brand-500) / 0.18)',
      },
      animation: {
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2.5s infinite',
      },
    },
  },
  plugins: [],
}

export default config
