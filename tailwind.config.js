/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors will be set via CSS variables
        'theme-bg': 'var(--theme-bg)',
        'theme-bg-secondary': 'var(--theme-bg-secondary)',
        'theme-primary': 'var(--theme-primary)',
        'theme-secondary': 'var(--theme-secondary)',
        'theme-accent': 'var(--theme-accent)',
        'theme-text': 'var(--theme-text)',
        'theme-text-secondary': 'var(--theme-text-secondary)',
      },
    },
  },
  plugins: [],
}
