/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0b0f17',       // Main deep dark slate background
          card: '#111827',     // Lighter card/container background
          border: '#1f2937',   // Borders
          input: '#1f2937',    // Input fields background
        },
        brand: {
          primary: '#2563eb',  // Vibrant blue for buttons and links
          hover: '#1d4ed8',    // Darker blue for hover states
          text: '#3b82f6',     // Light blue text
        },
        accent: {
          gold: '#eab308',     // Amber/gold for TIR metric
        },
        status: {
          completed: {
            bg: '#065f46',     // Dark green
            text: '#34d399',   // Light green
          },
          process: {
            bg: '#374151',     // Dark gray/blue
            text: '#d1d5db',   // Light gray
          },
          rejected: {
            bg: '#7f1d1d',     // Dark red
            text: '#f87171',   // Light red
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
