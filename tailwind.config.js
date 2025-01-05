/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			bebas: [
  				'Bebas Neue"',
  				'cursive'
  			],
  			cinzel: [
  				'Cinzel"',
  				'serif'
  			],
  			creepster: [
  				'Creepster"',
  				'sans-serif'
  			],
  			playfair: [
  				'Playfair Display"',
  				'serif'
  			],
  			nabla: [
  				'Nabla"',
  				'sans-serif'
  			],
  			lobster: [
  				'Lobster"',
  				'cursive'
  			],
  			dancing: [
  				'Dancing Script"',
  				'cursive'
  			],
  			courier: [
  				'Courier Prime"',
  				'monospace'
  			],
  			abril: [
  				'Abril Fatface"',
  				'cursive'
  			],
  			oswald: [
  				'Oswald"',
  				'sans-serif'
  			],
  			sourceSerif: [
  				'Source Serif Pro"',
  				'serif'
  			],
  			pacifico: [
  				'Pacifico"',
  				'cursive'
  			],
  			fjalla: [
  				'Fjalla One"',
  				'sans-serif'
  			],
  			marker: [
  				'Permanent Marker"',
  				'cursive'
  			],
  			shadows: [
  				'Shadows Into Light"',
  				'cursive'
  			],
  			lora: [
  				'Lora"',
  				'serif'
  			],
  			default: [
  				'Poppins"',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
}
