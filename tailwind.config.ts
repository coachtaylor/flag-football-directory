import type { Config } from 'tailwindcss'
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { 
    extend: {
      colors: {
        // Primary Colors - Orange (Energy, Action)
        primary: {
          50: 'rgb(254 245 235)',
          100: 'rgb(254 237 220)',
          200: 'rgb(253 220 185)',
          300: 'rgb(252 195 140)',
          400: 'rgb(250 154 85)',
          500: 'rgb(248 146 58)',
          600: 'rgb(232 122 0)',     // Main brand orange - #e87a00
          700: 'rgb(194 102 0)',
          800: 'rgb(155 82 0)',
          900: 'rgb(116 61 0)',
        },
        // Secondary Colors - Dark Navy (Trust, Authority)
        secondary: {
          50: 'rgb(240 244 247)',
          100: 'rgb(225 235 242)',
          200: 'rgb(195 215 230)',
          300: 'rgb(145 180 205)',
          400: 'rgb(85 135 170)',
          500: 'rgb(52 92 114)',   // Mid tone - #345c72
          600: 'rgb(39 69 85)',
          700: 'rgb(26 46 57)',
          800: 'rgb(13 23 29)',
          900: 'rgb(0 31 61)',     // Main brand navy - #001f3d
          950: 'rgb(0 16 31)',
        },
        // Accent Colors - Medium Blue-Gray
        accent: {
          50: 'rgb(240 244 247)',
          100: 'rgb(225 235 242)',
          200: 'rgb(195 215 230)',
          300: 'rgb(145 180 205)',
          400: 'rgb(85 135 170)',
          500: 'rgb(52 92 114)',      // Main accent - #345c72
          600: 'rgb(42 74 91)',
          700: 'rgb(31 55 68)',
          800: 'rgb(21 37 46)',
          900: 'rgb(10 18 23)',
        },
        // Background & Surface Colors
        base: 'rgb(246 246 246)',           // Brand light gray #f6f6f6
        subtle: 'rgb(255 255 255)',         // Pure white
        muted: 'rgb(235 235 235)',          // Slightly darker gray
        surface: 'rgb(255 255 255)',        // Cards, panels - white
        'surface-raised': 'rgb(255 255 255)', // Elevated elements
        // Border Colors
        'border-base': 'rgb(229 231 235)',  // Light border
        'border-strong': 'rgb(209 213 219)', // Stronger border
      }
    } 
  },
  plugins: [],
}
export default config
