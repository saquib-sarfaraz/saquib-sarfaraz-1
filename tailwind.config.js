/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        void: '#0B0D12',
        glass: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 255, 255, 0.08)',
        deepBg: '#080A12',
        secondaryBg: '#10131D',
        graphiteSurface: '#171A25',
        raisedSurface: '#222633',
        neutralBorder: '#414655',
        highlightBorder: '#747B8B',
        silverText: '#C6CBD6',
        primaryText: '#F5F6FA',
        mutedText: '#949BAA',
        whiteHighlight: '#FFFFFF',
      },
      backgroundImage: {
        'glass-gradient':
          'linear-gradient(145deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glow-gradient':
          'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
        'silver-beam':
          'linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.15) 100%)',
      },
      boxShadow: {
        neon: '0 0 20px rgba(255, 255, 255, 0.15)',
        card: '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
      },
    },
  },
  plugins: [],
}

