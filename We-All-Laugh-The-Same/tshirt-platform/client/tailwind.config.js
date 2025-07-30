/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dandelion: '#FFC107',
        'brand-off-white': '#f9f9f9',
        'brand-black': '#1a1a1a',
        'brand-white': '#ffffff',
      },
      backgroundImage: {
        'radial-gradient-custom':`radial-gradient(circle at bottom left, #120b37, transparent),
                                 radial-gradient(circle at bottom right, #ffc107, transparent),
                                 radial-gradient(circle at top center, #ff1234, transparent)`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
