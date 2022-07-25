import {
  createGlobalTheme,
  createThemeContract,
  createVar,
  globalStyle,
} from "@vanilla-extract/css";
import {defaultDarkTheme, defaultLightTheme} from "./consts";

globalStyle('html, body', {
  textRendering: "geometricPrecision",
});

const defaultFont = {
  fontFamily: "'Inter'",
  fontStyle: 'normal'
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

type variations = keyof variationMap;

type typographySizes = {
  [Property in keyof variationMap]: fonts;
};

type typography = {
  h1: fonts;
  h2: fonts;
  h3: fonts;
  paragraph: fonts;
  caption: fonts;
  button: typographySizes;
  input: typographySizes;
}

export const accentDefaultColor = createVar();
export const accentMutedColor = createVar();
export const accentEmphasisColor = createVar();

export const errorEmphasisColor = createVar("errorEmphasisColor");

export const successEmphasisColor = createVar("successEmphasisColor");

export const textDefaultColor = createVar("textDefaultColor");
export const textDisabledColor = createVar("textDisabledColor");

export const typographyCaptionRegularFontWeight = createVar("typographyCaptionRegularFontWeight");

export const colorsContract = createThemeContract({
  accent: {
    default: null,
    muted: null,
    emphasis: null,
    disabled: null,
    subtle: null
  },
  foreground: {
    default: null,
    muted: null,
    subtle: null,
    disabled: null,
    onDark: null,
    onDisabled: null,
    onAccent: null
  },
  background: {
    surface: null,
    canvas: null
  },
  error: {
    default: null,
    subtle: null,
    muted: null,
    emphasis: null
  },
  success: {
    emphasis: null
  },
  border: {
    default: null
  },
  text: {
    default: null,
    disabled: null
  },
  input: {
    background: null,
    disabled: null,
    placeholder: null,
    text: null
  }
})

const typographyContract = createThemeContract({
  caption: {
    regular: {
      fontWeight: null,
      fontSize: null,
      lineHeight: null,
      fontStyle: null
    },
    bold: {
      fontWeight: null,
      fontSize: null,
      lineHeight: null,
      fontStyle: null
    }
  },
})

export const lightTheme = createGlobalTheme(":root", {
  ...defaultLightTheme
})

export const darkTheme = createGlobalTheme(":root", {
  ...defaultDarkTheme,
})

/*const typographyTheme = createTheme({
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
})*/

export const root = createGlobalTheme(':root', {
  themeMode: 'light',
})

type theme<Type> = {
  [Property in keyof Type]: Type[Property]
}

export const theme = {base: root, light: lightTheme, dark: darkTheme};
