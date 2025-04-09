/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#00244E",
        secondary: "#38B2AC",
        accent: "#FF7900",
        light: {
          100: '#D6C6FF',
          200: '#A8B5DB',
          300: '#9CA4AB',
        },
        dark: {
          100: '#221f3d',
          200: '#0f0d23',
          300: '#0a0817',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-elevation')(['responsive']),
  ],
}

