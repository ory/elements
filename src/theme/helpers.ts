import { ThemeProps as StyledThemeProps } from 'styled-components';

export const pxToRem = (...px: number[]) => px.map((x) => `${x / 16}rem`).join(' ');

export const palettes = {
  light: {
    accent: {
      def: '#3D53F5',
      muted: '#6475F7',
      emphasis: '#3142C4',
      disabled: '#E0E0E0'
    },
    foreground: {
      def: '#17171717',
      muted: '#616161',
      subtle: '#9E9E9E',
      disabled: '#BDBDBD',
      onDark: '#FFFFFF'
    },
    error: {
      emphasis: '#DF1642'
    },
    success: {
      emphasis: '#18A957'
    },
    border: {
      def: '#E0E0E0',
      disabled: '#EEEEEE'
    },
    text: {
      def: '#FFFFFF',
      disabled: '#757575'
    },
    input: {
      background: '#FFFFFF',
      disabled: '#E0E0E0',
      placeholder: '#9E9E9E',
      text: '#424242'
    }
  }
}

type fonts = {
  fontWeight: number,
  fontSize: string,
  lineHeight: string,
  fontFamily: string,
  fontStyle: string
}

type variationMap = {
  small: string,
  medium: string,
  large: string
}

export type variations = keyof variationMap;

type typographySizes = {
  [Property in keyof variationMap]: fonts
}

export const defaultFont = {
  fontFamily: "'Inter'",
  fontStyle: "normal"
}

export const typography: {
  h1: fonts,
  h2: fonts,
  h3: fonts,
  paragraph: fonts,
  button: typographySizes,
  input: typographySizes,
} = {
  h1: {
    fontWeight: 500,
    lineHeight: pxToRem(40),
    fontSize: pxToRem(32),
    ...defaultFont
  },
  h2: {
    fontWeight: 400,
    lineHeight: pxToRem(24),
    fontSize: pxToRem(16),
    ...defaultFont
  },
  h3: {
    fontWeight: 400,
    lineHeight: pxToRem(20),
    fontSize: pxToRem(14),
    ...defaultFont
  },
  paragraph: {
    fontWeight: 300,
    fontSize: pxToRem(14),
    lineHeight: pxToRem(20),
    ...defaultFont
  },
  button: {
    large: {
      fontSize: pxToRem(18),
      lineHeight: pxToRem(32),
      fontWeight: 600,
      ...defaultFont
    },
    medium: {
      fontSize: pxToRem(16),
      lineHeight: pxToRem(28),
      fontWeight: 600,
      ...defaultFont
    },
    small: {
      fontSize: pxToRem(14),
      lineHeight: pxToRem(20),
      fontWeight: 600,
      ...defaultFont
    }
  },
  input: {
    small: {
      fontSize: pxToRem(16),
      lineHeight: pxToRem(24),
      fontWeight: 400,
      ...defaultFont
    },
    medium: {
      fontSize: pxToRem(16),
      lineHeight: pxToRem(24),
      fontWeight: 400,
      ...defaultFont
    },
    large: {
      fontSize: pxToRem(18),
      lineHeight: pxToRem(32),
      fontWeight: 400,
      ...defaultFont
    }
  }
}

export const theme = {
  palettes: palettes,
  typography: typography,
  
  cards: {
    borderRadius: '16px'
  },
  
  buttons: {
    borderRadius: '4px'
  },
  
  inputs : {
    borderRadius: '4px'
  },
  
  grey0: '#F9F9FA',
  grey5: '#F0F0F1',
  grey10: '#E1E1E3',
  grey30: '#B4B4BB',
  grey60: '#5A5B6A',
  grey70: '#4A4B57',
  grey100: '#19191D',

  blue30: '#9DC2FF',
  blue60: '#2979FF',
  blue70: '#2264D1',

  green30: '#A9D3AB',
  green60: '#43A047',
  green70: '#37833B',

  red30: '#FAA9A3',
  red60: '#F44336',
  red70: '#C8372D',

  blueGrey30: '#B4BBE2',
  blueGrey60: '#97A0D6',
  
  primary30: '#F6A8C2',
  primary60: '#EC407A',
  primary70: '#C23564',

  regularFont300: "'Rubik', sans-serif",
  regularFont400: "'Rubik', sans-serif",
  regularFont500: "'Rubik', sans-serif",
  codeFont400: "'Roboto Mono', sans-serif"
};

export type Theme = typeof theme & {
  platform?: 'react-native' | 'react';
};

export type ThemeProps = StyledThemeProps<Theme>;

export function wrapCss(className: string, css: string) {
  return `${'.' + className} {
  ${css}
}`;
}
