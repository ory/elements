import {
  createGlobalTheme,
  createTheme,
  createThemeContract,
  createVar,
  fallbackVar,
  globalStyle,
} from "@vanilla-extract/css";
import {pxToRem} from "../utils";

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

type mediaQueries<T> = {
  xs: T
  sm: T
  md: T
  lg: T
  xl: T
}

const breakpoints: {
  [Property in keyof mediaQueries<string>]: string;
} = {
  xs: pxToRem(0),
  sm: pxToRem(600),
  md: pxToRem(960),
  lg: pxToRem(1280),
  xl: pxToRem(1920)
}

export const colorMode = createVar();

export const accentDefaultColor = createVar();
export const accentMutedColor = createVar();
export const accentEmphasisColor = createVar();
export const accentDisabledColor = createVar();

export const foregroundDefaultColor = createVar();
export const foregroundMutedColor = createVar();
export const foregroundSubtleColor = createVar();
export const foregroundDisabledColor = createVar();
export const foregroundOnDarkColor = createVar();

export const backgroundSurfaceColor = createVar();
export const backgroundCanvasColor = createVar();

export const errorDefaultColor = createVar();
export const errorEmphasisColor = createVar();
export const errorSubtleColor = createVar();
export const errorMutedColor = createVar();

export const successEmphasisColor = createVar();

export const borderDefaultColor = createVar();

export const textDefaultColor = createVar();
export const textDisabledColor = createVar();

const colorsContract = createThemeContract({
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
  tiny: {
    bold: null,
    regular: null
  },
  xsmall: {
    bold: null,
    regular: null
  },
  small: {
    bold: null,
    regular: null
  },
  caption: {
    bold: null,
    regular: null
  },
  body: {
    bold: null,
    regular: null
  },
  lead: {
    bold: null,
    regular: null
  }
})

const lightTheme = createTheme(colorsContract, {
  accent: {
    default: fallbackVar(accentDefaultColor, '#3D53F5'),
    muted: fallbackVar(accentMutedColor, '#6475F7'),
    emphasis: fallbackVar(accentEmphasisColor, '#3142C4'),
    disabled: fallbackVar(accentDisabledColor, '#E0E0E0'),
    subtle: fallbackVar(accentDisabledColor, '#eceefe')
  },
  foreground: {
    default: fallbackVar(foregroundDefaultColor, '#171717'),
    muted: fallbackVar(foregroundMutedColor, '#616161'),
    subtle: fallbackVar(foregroundSubtleColor, '#9E9E9E'),
    disabled: fallbackVar(foregroundDisabledColor, '#BDBDBD'),
    onDark: fallbackVar(foregroundOnDarkColor, '#FFFFFF'),
    onAccent: fallbackVar(foregroundOnDarkColor, '#FFFFFF'),
    onDisabled: fallbackVar(foregroundOnDarkColor, '#e0e0e0'),
  },
  background: {
    surface: fallbackVar(backgroundSurfaceColor, '#FFFFFF'),
    canvas: fallbackVar(backgroundCanvasColor, '#FCFCFC'),
  },
  error: {
    default: fallbackVar(errorDefaultColor, '#9c0f2e'),
    subtle: fallbackVar(errorSubtleColor, '#fce8ec'),
    muted: fallbackVar(errorMutedColor, '#e95c7b'),
    emphasis: fallbackVar(errorEmphasisColor, '#DF1642'),
  },
  success: {
    emphasis: fallbackVar(successEmphasisColor, '#18A957'),
  },
  border: {
    default: fallbackVar(borderDefaultColor, '#E0E0E0')
  },
  text: {
    default: fallbackVar(textDefaultColor, '#FFFFFF'),
    disabled: fallbackVar(textDisabledColor, '#757575')
  },
  input: {
    background: createVar('#FFFFFF'),
    disabled: createVar('#E0E0E0'),
    placeholder: createVar('#9E9E9E'),
    text: createVar('#424242')
  }
})

const darkTheme = createTheme(colorsContract, {
  accent: {
    default: fallbackVar(accentDefaultColor, '#6475f7'),
    disabled: fallbackVar(accentDisabledColor, '#757575'),
    muted: fallbackVar(accentMutedColor, '#3142c4'),
    emphasis: fallbackVar(accentEmphasisColor, '#3d53f5'),
    subtle: fallbackVar(accentDisabledColor, '#0c1131')
  },
  foreground: {
    default: fallbackVar(foregroundDefaultColor, '#FFFFFF'),
    muted: fallbackVar(foregroundMutedColor, '#ddd9f7'),
    subtle: fallbackVar(foregroundSubtleColor, '#9a8ce8'),
    onDark: fallbackVar(foregroundOnDarkColor, '#FFFFFF'),
    onAccent: fallbackVar(foregroundOnDarkColor, '#FFFFFF'),
    onDisabled: fallbackVar(foregroundOnDarkColor, '#e0e0e0'),
    disabled: fallbackVar(foregroundDisabledColor, '#bdbdbd')
  },
  background: {
    surface: fallbackVar(backgroundSurfaceColor, '#110d2b'),
    canvas: fallbackVar(backgroundCanvasColor, '#090616')
  },
  border: {
    default: fallbackVar(borderDefaultColor, '#221956'),
  },
  error: {
    default: fallbackVar(errorDefaultColor, '#e95c7b'),
    subtle: fallbackVar(errorSubtleColor, '#2d040d'),
    muted: fallbackVar(errorMutedColor, '#9c0f2e'),
    emphasis: fallbackVar(errorEmphasisColor, '#df1642'),
  },
  success: {
    emphasis: fallbackVar(successEmphasisColor, '#18a957'),
  },
  input: {
    background: fallbackVar(backgroundSurfaceColor, '#FFFFFF'),
    text: fallbackVar(textDefaultColor, '#424242'),
    placeholder: fallbackVar(textDefaultColor, '#9e9e9e'),
    disabled: fallbackVar(textDisabledColor, '#eeeeee')
  },
  text: {
    default: fallbackVar(textDefaultColor, '#FFFFFF'),
    disabled: fallbackVar(textDisabledColor, '#757575')
  }
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

const root = createGlobalTheme(':root', {
  themeMode: fallbackVar(colorMode, 'light'),
})

export const theme = {...root, light: lightTheme, dark: darkTheme};
