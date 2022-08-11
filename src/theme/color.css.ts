import { oryTheme } from './theme.css';
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';

const colorProperties = defineProperties({
  properties: {
    color: {
      'accent-disabled': oryTheme.accent.disabled,
      'accent-default': oryTheme.accent.def,
      'accent-muted': oryTheme.accent.muted,
      'accent-subtle': oryTheme.accent.subtle,
      'accent-emphasis': oryTheme.accent.emphasis,
      'foreground-default': oryTheme.foreground.def,
      'foreground-muted': oryTheme.foreground.muted,
      'foreground-subtle': oryTheme.foreground.subtle,
      'foreground-disabled': oryTheme.foreground.disabled,
      'foreground-on-dark': oryTheme.foreground.onDark,
      'foreground-on-accent': oryTheme.foreground.onAccent,
      'background-surface': oryTheme.background.surface,
      'background-canvas': oryTheme.background.canvas,
      'error-default': oryTheme.error.def,
      'error-subtle': oryTheme.error.subtle,
      'error-muted': oryTheme.error.muted,
      'error-emphasis': oryTheme.error.emphasis,
      'success-emphasis': oryTheme.success.emphasis,
      'border-default': oryTheme.border.def,
      'text-default': oryTheme.text.def,
      'text-disabled': oryTheme.text.disabled,
      'input-background': oryTheme.input.background,
      'input-disabled': oryTheme.input.disabled,
      'input-placeholder': oryTheme.input.placeholder,
      'input-text': oryTheme.input.text
    }
  }
});

export const colorSprinkle = createSprinkles(colorProperties);

// It's a good idea to export the Sprinkles type too
export type ColorSprinkle = Parameters<typeof colorSprinkle>[0];
