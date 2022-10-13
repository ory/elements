import { NullableTokens } from "@vanilla-extract/css/dist/declarations/src/types"
import { pxToEm } from "../common"

export interface Font extends NullableTokens {
  fontFamily: string
  fontStyle: string
}

export type BreakPoints = {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xl2: string
}

export const defaultBreakpoints: BreakPoints = {
  // using em here as it is more consistent across browsers
  xs: pxToEm(390),
  sm: pxToEm(640),
  md: pxToEm(768),
  lg: pxToEm(1024),
  xl: pxToEm(1280),
  xl2: pxToEm(1536),
}

export type Theme = {
  fontFamily: string
  fontStyle: string
  accent: {
    def: string
    muted: string
    emphasis: string
    disabled: string
    subtle: string
  }
  foreground: {
    def: string
    muted: string
    subtle: string
    disabled: string
    onDark: string
    onAccent: string
    onDisabled: string
  }
  background: {
    surface: string
    canvas: string
    subtle: string
  }
  error: {
    def: string
    subtle: string
    muted: string
    emphasis: string
  }
  success: {
    emphasis: string
  }
  border: {
    def: string
  }
  text: {
    def: string
    disabled: string
  }
  input: {
    background: string
    disabled: string
    placeholder: string
    text: string
  }
}

export const defaultFont: Font = {
  fontFamily: "Inter",
  fontStyle: "normal",
}

export const defaultLightTheme: Theme = {
  fontFamily: "Inter",
  fontStyle: "normal",
  accent: {
    def: "#3D53F5",
    muted: "#6475F7",
    emphasis: "#3142C4",
    disabled: "#E0E0E0",
    subtle: "#eceefe",
  },
  foreground: {
    def: "#171717",
    muted: "#616161",
    subtle: "#9E9E9E",
    disabled: "#BDBDBD",
    onDark: "#FFFFFF",
    onAccent: "#FFFFFF",
    onDisabled: "#e0e0e0",
  },
  background: {
    surface: "#FFFFFF",
    canvas: "#FCFCFC",
    subtle: "#EEEEEE",
  },
  error: {
    def: "#9c0f2e",
    subtle: "#fce8ec",
    muted: "#e95c7b",
    emphasis: "#DF1642",
  },
  success: {
    emphasis: "#18A957",
  },
  border: {
    def: "#EEEEEE",
  },
  text: {
    def: "#FFFFFF",
    disabled: "#757575",
  },
  input: {
    background: "#FFFFFF",
    disabled: "#E0E0E0",
    placeholder: "#9E9E9E",
    text: "#424242",
  },
}

export const defaultDarkTheme: Theme = {
  fontFamily: "Inter",
  fontStyle: "normal",
  accent: {
    def: "#6475f7",
    disabled: "#757575",
    muted: "#3142c4",
    emphasis: "#3d53f5",
    subtle: "#0c1131",
  },
  foreground: {
    def: "#FFFFFF",
    muted: "#ddd9f7",
    subtle: "#9a8ce8",
    onDark: "#FFFFFF",
    onAccent: "#FFFFFF",
    onDisabled: "#e0e0e0",
    disabled: "#bdbdbd",
  },
  background: {
    surface: "#110d2b",
    canvas: "#090616",
    subtle: "#221C56",
  },
  border: {
    def: "#221956",
  },
  error: {
    def: "#e95c7b",
    subtle: "#2d040d",
    muted: "#9c0f2e",
    emphasis: "#df1642",
  },
  success: {
    emphasis: "#18a957",
  },
  input: {
    background: "#FFFFFF",
    text: "#424242",
    placeholder: "#9e9e9e",
    disabled: "#eeeeee",
  },
  text: {
    def: "#FFFFFF",
    disabled: "#757575",
  },
}
