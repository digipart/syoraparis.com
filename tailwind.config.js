/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: () => ({
        primary: 'var(--color-primary)',
        'white-text': 'var(--color-white-text)',
        'gray-888': '#888888',
        'gray-777': '#777777',
        'gray-bbb': '#bbbbbb',
      }),
      screens: {
        sm: '640px',
        md: '768px',
        lg: '992px',
        xl: '1280px',
        '2xl': '1574px',
        xsMax: { max: '639.98px' },
        smMax: { max: '767.98px' },
        mdMax: { max: '991.98px' },
        lgMax: { max: '1279.98px' },
        xlMax: { max: '1573.98px' },
      },
      fontFamily: {
        primary: 'var(--font-primary)',
        secondary: 'var(--font-secondary)',
      },
      fontSize: {
        xxs: [
          '0.625rem',
          {
            lineHeight: '1.111',
          },
        ],
      },
    },
  },
  plugins: [],
};
