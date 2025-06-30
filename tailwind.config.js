module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],  // Changed from purge
  darkMode: 'media', // Changed from false
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#FBBF24',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};