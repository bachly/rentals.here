module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./tailwindcss-templates/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      'not-allowed': 'not-allowed',
      'zoom-in': 'zoom-in',
      'zoom-out': 'zoom-out'
    },
    opacity: {
      '0': '0',
      '10': '.1',
      '20': '.2',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '70': '.7',
      '80': '.8',
      '90': '.9',
      '95': '.95',
      '100': '1',
    },
    // screens: {
    //   'sm': '640px', // => @media (min-width: 640px) { ... }
    //   'md': '768px', // => @media (min-width: 768px) { ... }
    //   'lg': '1024px', // => @media (min-width: 1024px) { ... }
    //   'xl': '1280px', // => @media (min-width: 1280px) { ... }
    //   '2xl': '1536px' // => @media (min-width: 1536px) { ... }
    // },
    extend: {
      colors: {
        "dark": "#111827",
        "light": "#FBF8F6",
        "primary": "#2E889F",
        "secondary": "#155362",
        "success": "#7FAF6E"
      },
      fontFamily: {
        display: ['Anton'],
        body: ['Mulish']
      },
      gridTemplateRows: {
        '10': 'repeat(10, minmax(0, 1fr))'
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '96rem',
      },
      screens: {
        'print': { 'raw': 'print' }
      },
      spacing: {
        "1/1": "100%",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "9/16": "56.25%",
        "3/2": "150%",
        "4/3": "133.33%",
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      display: ['group-hover'],
      opacity: ['disabled'],
    }
  },
  plugins: [],
}