/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji'
        ]
      },
      container: {
        center: true,
        padding: '1rem'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch'
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}