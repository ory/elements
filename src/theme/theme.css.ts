import {createGlobalThemeContract} from "@vanilla-extract/css";
import { pxToRem } from "../utils";

export const defaultFont = {
  fontFamily: "'Inter'",
  fontStyle: 'normal'
};

export const palettes = {
  light: {
    accent: {
      def: '#3D53F5',
      muted: '#6475F7',
      emphasis: '#3142C4',
      disabled: '#E0E0E0'
    },
    foreground: {
      def: '#171717',
      muted: '#616161',
      subtle: '#9E9E9E',
      disabled: '#BDBDBD',
      onDark: '#FFFFFF'
    },
    background: {
      surface: '#FFFFFF',
      canvas: '#FCFCFC'
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
};

type fonts = {
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  fontFamily: string;
  fontStyle: string;
};

type variationMap = {
  small: string;
  medium: string;
  large: string;
};

export type variations = keyof variationMap;

type typographySizes = {
  [Property in keyof variationMap]: fonts;
};

export type typography = {
  h1: fonts;
  h2: fonts;
  h3: fonts;
  paragraph: fonts;
  caption: fonts;
  button: typographySizes;
  input: typographySizes;
}

export const typography: typography = {
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
  caption: {
    fontWeight: 400,
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
};

export type mediaQueries<T> = {
  xs: T
  sm: T
  md: T
  lg: T
  xl: T
}

export const breakpoints: {
  [Property in keyof mediaQueries<string>]: string;
} = {
  xs: pxToRem(0),
  sm: pxToRem(600),
  md: pxToRem(960),
  lg: pxToRem(1280),
  xl: pxToRem(1920)
}

export const theme = createGlobalThemeContract({
  palettes,
  breakpoints,
})
