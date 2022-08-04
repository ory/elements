import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { oryTheme } from './theme.css';

export const colorStyle = recipe({
  variants: {
    color: {
      accentDisabled: oryTheme.accent.disabled,
      accentDefault: oryTheme.accent.default,
      accentMuted: oryTheme.accent.muted,
      accentSubtle: oryTheme.accent.subtle,
      accentEmphasis: oryTheme.accent.emphasis,
      foregroundDefault: oryTheme.foreground.default,
      foregroundMuted: oryTheme.foreground.muted,
      foregroundSubtle: oryTheme.foreground.subtle,
      foregroundDisabled: oryTheme.foreground.disabled,
      foregroundOnDark: oryTheme.foreground.onDark,
      foregroundOnAccent: oryTheme.foreground.onAccent,
      backgroundSurface: oryTheme.background.surface,
      backgroundCanvas: oryTheme.background.canvas,
      errorDefault: oryTheme.error.default,
      errorSubtle: oryTheme.error.subtle,
      errorMuted: oryTheme.error.muted,
      errorEmphasis: oryTheme.error.emphasis,
      successEmphasis: oryTheme.success.emphasis,
      borderDefault: oryTheme.border.default,
      textDefault: oryTheme.text.default,
      textDisabled: oryTheme.text.disabled,
      inputBackground: oryTheme.input.background,
      inputDisabled: oryTheme.input.disabled,
      inputPlaceholder: oryTheme.input.placeholder,
      inputText: oryTheme.input.text
    }
  }
});

// Get the type
export type ColorStyle = RecipeVariants<typeof colorStyle>;
