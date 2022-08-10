import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { oryTheme } from './theme.css';

export const colorStyle = recipe({
  variants: {
    themeColor: {
      accentDisabled: oryTheme.accent.disabled,
      accentDefault: oryTheme.accent.def,
      accentMuted: oryTheme.accent.muted,
      accentSubtle: oryTheme.accent.subtle,
      accentEmphasis: oryTheme.accent.emphasis,
      foregroundDefault: oryTheme.foreground.def,
      foregroundMuted: oryTheme.foreground.muted,
      foregroundSubtle: oryTheme.foreground.subtle,
      foregroundDisabled: oryTheme.foreground.disabled,
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
      inputText: oryTheme.input.text
    }
  }
});

// Get the type
export type ColorStyle = RecipeVariants<typeof colorStyle>;
