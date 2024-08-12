import type { Config } from 'tailwindcss';
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      screens: {
        'vsm': '500px',
      },
      boxShadow: {
        '3xl': '5px -5px 15px 0px rgba(0, 0, 0, 0.3), -5px 5px 30px 0px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        'redWS': '#ff5757',
        'blueWS': '#25aae1',
        'yellowWS': '#f7941d',
        'cardColor': '#ffffff',
        'darkCardColor': '#2c2c2c',
        'disableCardColor': '#d3d3d3',
        'disableDarkCardColor': '#202020',
        'hoverRedWS': '#c72f2f',
        'darkRedWS': '#c72f2f',
        'hoverDarkRedWS': '#aa2525',
        'darkBackground': '#121212',
        'darkGray': '#2c2c2c',
        'lightBackground': '#EEEEEE',
        'grayBackground': '#EBEBEB',
        'fadeWhite' : '#cfcbcb',
        'fadeGray' : '#565656',
        'grayIcon': "#8D8B8B",
        'redError': '#ff0000',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transitionProperty: {
        'text-opacity': 'text-opacity',
        'text-size': 'font-size'
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#ff5757",
            },
            secondary: {
              DEFAULT: "#8D8B8B",
            },
            danger: {
              DEFAULT: "#ff0000",
            },
            focus: "#c72f2f",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#ff5757",
            },
            danger: {
              DEFAULT: "#ff0000",
            },
            focus: "#c72f2f",
          },
        },
      },
    }),
  ],
}
export default config
