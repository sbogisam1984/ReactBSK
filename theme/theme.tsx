import { Figtree } from 'next/font/google';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import NextLink from 'next/link';
import { forwardRef } from 'react';
import { Circle } from '@mui/icons-material';

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  // @ts-expect-error forwardRef is not assignable to NextLink
  return <NextLink ref={ref} {...props} />;
});

const figtree = Figtree({ subsets: ['latin'], display: 'swap' });

const fontStack = [figtree.style.fontFamily, 'Arial', 'sans-serif'].join(',');

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#cb4a20', // Poppy
    },
    secondary: {
      main: '#808080',
    },
    text: {
      primary: '#000000',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: fontStack,
    button: {
      textTransform: 'uppercase',
      fontWeight: 400,
    },
    h1: {
      fontSize: '30px',
      fontWeight: 400,
    },
    h2: {
      fontSize: '30px',
      fontWeight: 400,
    },
    h3: {
      fontSize: '30px',
      fontWeight: 400,
    },
    h4: {
      fontSize: '24px',
      fontWeight: 400,
    },
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {},
      },
      defaultProps: {
        checkedIcon: <Circle />,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: fontStack,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      },
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          height: '40px',
          textTransform: 'uppercase',
          fontWeight: 300,
          borderRadius: 0,
          '@media (max-width:600px)': {
            height: '36px',
            padding: '6px 16px',
          },
        },
        outlined: {
          color: '#000000',
          borderColor: '#000000',
          backgroundColor: '#ffffff',
          '&:hover': {
            color: '#ffffff',
            backgroundColor: '#000000',
            borderColor: '#000000',
          },
        },
        contained: {
          color: '#ffffff',
          backgroundColor: '#cb4a20',
          '&:hover': {
            color: '#cb4a20',
            backgroundColor: '#ffffff',
            borderColor: '#cb4a20',
            border: '1px solid',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ebebeb',
          borderRadius: 10,
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
  factor: 5, // Increase/decrease this value to make the scaling more/less aggressive
  variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2'],
});

export { theme };
