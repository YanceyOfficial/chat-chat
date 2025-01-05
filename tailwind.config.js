/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      '3xl': '1920px'
    },
    extend: {
      fontSize: {
        10: 2 / 3 + 'rem' // 10px
      },
      width: {
        2.5: '0.625rem', // 10px
        14: '3.5rem', // 56px
        22: '5.5rem', // 88px
        75: '18.75rem', // 300px
        87.75: '21.9375rem', // 352px
        160: '40rem' // 640px
      },
      minWidth: {
        22: '5.5rem', // 88px
        50: '12.5rem' // 200px
      },
      minHeight: {
        6: '1.5rem' // 24px
      },
      maxWidth: {
        160: '40rem' // 640px
      },
      height: {
        2.5: '0.625rem', // 10px
        22: '5.5rem', // 88px
        160: '40rem' // 640px
      },
      colors: {
        'main-purple': '#615ef0',
        'main-gray': '#f1f1f1',
        'default-badge': '#edf2f7',
        'search-input': '#f3f3f3',
        'status-green': '#68d391',
        'dark-search-input': '#3b3b3b',
        'dark-main-bg': '#131516',
        'dark-text': '#e6edf3',
        'dark-text-sub': '#7d8590',
        'dark-bubble-assistant-bg': '#202324',
        'dark-bubble-assistant-text': '#e8e6e3',
        'dark-search-input-border': '#34383a',
        'dark-divider-bg': '#30363d',
        'dark-text-secondary':'#b4b4b4',
        'dark-text-secondary':'#5d5d5d',
      },
      borderRadius: {
        14: '0.875rem' // 14px
      },
      boxShadow: {
        sidebar: '0px 0px 24px rgba(0, 0, 0, 0.08)',
        'dark-sidebar': '0px 0px 24px rgba(0, 0, 0, 0.4)'
      },
      margin: {
        0.5: '0.125rem', // 2px
        1.5: '0.375rem', // 6px
        2.5: '0.625rem', // 10px
        3.5: '0.875rem' // 14px
      },
      padding: {
        0.5: '0.125rem', // 2px
        1.5: '0.375rem', // 6px
        2.5: '0.625rem' // 10px
      },
      top: {
        3.5: '0.875rem' // 14px
      },
      transitionDuration: {
        250: '250ms'
      },
      keyframes: {
        wiggle: {
          '0%': { backgroundPosition: 0 },
          '100%': { backgroundPosition: '400%' }
        }
      },
      animation: {
        wiggle: 'wiggle 10s linear infinite'
      }
    }
  }
}
