/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
        cinzel: ['"Cinzel"', 'serif'],
        creepster: ['"Creepster"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        nabla: ['"Nabla"', 'sans-serif'],
        lobster: ['"Lobster"', 'cursive'],
        dancing: ['"Dancing Script"', 'cursive'],
        courier: ['"Courier Prime"', 'monospace'],
        abril: ['"Abril Fatface"', 'cursive'],
        oswald: ['"Oswald"', 'sans-serif'],
        sourceSerif: ['"Source Serif Pro"', 'serif'],
        pacifico: ['"Pacifico"', 'cursive'],
        fjalla: ['"Fjalla One"', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        shadows: ['"Shadows Into Light"', 'cursive'],
        lora: ['"Lora"', 'serif'],
        default: ['"Poppins"', 'sans-serif']
      }
    }
  },
  plugins: []
}
