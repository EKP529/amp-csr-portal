'use client'

import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
 cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#0070DA",
        },
        secondary: {
          main: "#0070DA",
        },
        background: {
          default: "#F9F9FE",
          paper: "#DBEAFE",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#103161",
        },
        secondary: {
          main: "#103161",
        },
        background: {
          default: "#62748E",
          paper: "#003B74",
        },
      },
    },
  },
  typography: {
      fontFamily: 'var(--font-geist-sans)'
  }, 
});