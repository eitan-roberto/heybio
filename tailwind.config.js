/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        green: '#4ade80',
        pink: '#f472b6',
        orange: '#fb923c',
        yellow: '#facc15',
        brown: '#713f12',
        blue: '#60a5fa',
        top: '#09090b',
        high: '#3f3f46',
        mid: '#71717a',
        low: '#d4d4d8',
        bottom: '#fafafa',
      },
      borderRadius: {
        '4xl': '2rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
