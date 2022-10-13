import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles"
import { oryTheme } from "./theme.css"

export const colorProperties = defineProperties({
  properties: {
    color: {
      accentDisabled: oryTheme.accent.disabled,
      accentDefault: oryTheme.accent.def,
      accentMuted: oryTheme.accent.muted,
      accentSubtle: oryTheme.accent.subtle,
      accentEmphasis: oryTheme.accent.emphasis,
      foregroundDefault: oryTheme.foreground.def,
      foregroundMuted: oryTheme.foreground.muted,
      foregroundSubtle: oryTheme.foreground.subtle,
      foregroundDisabled: oryTheme.foreground.disabled,
      foregroundOnDisabled: oryTheme.foreground.onDisabled,
      foregroundOnDark: oryTheme.foreground.onDark,
      foregroundOnAccent: oryTheme.foreground.onAccent,
      backgroundSurface: oryTheme.background.surface,
      backgroundCanvas: oryTheme.background.canvas,
      errorDefault: oryTheme.error.def,
      errorSubtle: oryTheme.error.subtle,
      errorMuted: oryTheme.error.muted,
      errorEmphasis: oryTheme.error.emphasis,
      successEmphasis: oryTheme.success.emphasis,
      borderDefault: oryTheme.border.def,
      textDefault: oryTheme.text.def,
      textDisabled: oryTheme.text.disabled,
      inputBackground: oryTheme.input.background,
      inputDisabled: oryTheme.input.disabled,
      inputPlaceholder: oryTheme.input.placeholder,
      inputText: oryTheme.input.text,
    },
  },
})

export const colorSprinkle = createSprinkles(colorProperties)

// It's a good idea to export the Sprinkles type too
export type ColorSprinkle = Parameters<typeof colorSprinkle>[0]
