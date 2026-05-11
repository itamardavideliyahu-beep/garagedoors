import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ec',
          100: '#ffead0',
          200: '#ffd29a',
          300: '#ffb35c',
          400: '#ff9128',
          500: '#ff7510',
          600: '#f05905',
          700: '#c64107',
          800: '#9d340e',
          900: '#7e2c10',
          950: '#441405',
        },
        ink: {
          50: '#f5f7fa',
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(15, 22, 32, 0.15)',
        glow: '0 0 0 6px rgba(255, 117, 16, 0.18)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2.5s infinite',
      },
    },
  },
  plugins: [],
}

export default config
