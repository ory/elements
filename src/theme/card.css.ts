import { style } from '@vanilla-extract/css';
import { pxToRem } from '../utils';
import { oryTheme } from './theme.css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

// the base card style with media queries
const card = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(16),
  padding: pxToRem(48),
  background: oryTheme.background.surface,
  color: oryTheme.foreground.def,
  maxWidth: pxToRem(432),
  '@media': {
    'screen and (max-width: 768px)': {
      width: '100%',
      border: '0px',
      borderRadius: '0px',
      padding: `0px 0px ${pxToRem(32)}`
    }
  }
});

export const cardTitleStyle = style({
  textAlign: 'center'
});

// recipe for the card style
// this ensures we have themeable variations for the card
export const cardStyle = recipe({
  base: card
});

// Get the type
export type CardStyle = RecipeVariants<typeof cardStyle>;
