import {pxToRem} from "../utils";

export const defaultLightTheme = {
  accent: {
    default: '#3D53F5',
    muted: '#6475F7',
    emphasis: '#3142C4',
    disabled: '#E0E0E0',
    subtle: '#eceefe'
  },
  foreground: {
    default: '#171717',
    muted: '#616161',
    subtle: '#9E9E9E',
    disabled: '#BDBDBD',
    onDark: '#FFFFFF',
    onAccent: '#FFFFFF',
    onDisabled: '#e0e0e0',
  },
  background: {
    surface: '#FFFFFF',
    canvas: '#FCFCFC',
  },
  error: {
    default: '#9c0f2e',
    subtle: '#fce8ec',
    muted: '#e95c7b',
    emphasis: '#DF1642',
  },
  success: {
    emphasis: '#18A957',
  },
  border: {
    default: '#E0E0E0'
  },
  text: {
    default: '#FFFFFF',
    disabled: '#757575'
  },
  input: {
    background: '#FFFFFF',
    disabled: '#E0E0E0',
    placeholder: '#9E9E9E',
    text: '#424242'
  }
}

export const defaultDarkTheme = {
  accent: {
    default: '#6475f7',
    disabled: '#757575',
    muted: '#3142c4',
    emphasis: '#3d53f5',
    subtle: '#0c1131'
  },
  foreground: {
    default: '#FFFFFF',
    muted: '#ddd9f7',
    subtle: '#9a8ce8',
    onDark: '#FFFFFF',
    onAccent: '#FFFFFF',
    onDisabled: '#e0e0e0',
    disabled: '#bdbdbd'
  },
  background: {
    surface: '#110d2b',
    canvas: '#090616'
  },
  border: {
    default: '#221956',
  },
  error: {
    default: '#e95c7b',
    subtle: '#2d040d',
    muted: '#9c0f2e',
    emphasis: '#df1642',
  },
  success: {
    emphasis: '#18a957',
  },
  input: {
    background: '#FFFFFF',
    text: '#424242',
    placeholder: '#9e9e9e',
    disabled: '#eeeeee'
  },
  text: {
    default: '#FFFFFF',
    disabled: '#757575'
  }
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
