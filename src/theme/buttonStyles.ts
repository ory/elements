import {pxToRem, variations, ThemeProps, typographyButtonStyles, wrapCss} from './index';

export interface ButtonStyles extends ThemeProps {
  disabled?: boolean;
  size?: variations
}

export const buttonStyles = ({theme, size}: ButtonStyles) => {
  size = size || 'medium';
  return `

& .button {
  ${typographyButtonStyles({theme}, size)}
  color: ${theme.palettes.light.text.def};
  border-radius: ${theme.cards.borderRadius};
  
  width: 100%;
  min-height: ${pxToRem(size === 'large' ? 64 : size === 'small' ? 40 : 48)};
  
  border: 4px solid transparent;
  padding: ${size === 'small' || size === 'medium' ? pxToRem(10, 16) : pxToRem(16, 24)};
  outline: none;
  
  background-color: ${theme.palettes.light.accent.def};
 
  cursor: pointer;
}

& .button:disabled, & .button:hover:disabled {
  color: ${theme.palettes.light.text.disabled};
  background-color: ${theme.palettes.light.accent.disabled};
}

& .button.fake-hover,
& .button:hover {
  background-color: ${theme.palettes.light.accent.muted};
}

& .button.fake-focus,
& .button:focus {
  background-color: ${theme.palettes.light.accent.def};
  border-color: ${theme.palettes.light.accent.muted};
  outline: none;
}

& .button.fake-click,
& .button:active {
  background-color: ${theme.palettes.light.accent.emphasis};
  outline: none;
}

& .button-text {
  display: flex;
  align-items: center;
  text-align: center;
}
`}

export const cssButtonStyles = (props: ThemeProps) =>
  wrapCss('input-button', buttonStyles({...props, size: 'medium'}));

export const cssButtonStylesLarge = (props: ThemeProps) =>
  wrapCss('input-button-large', buttonStyles({...props, size: 'large'}));

export const cssButtonStylesSmall = (props: ThemeProps) =>
  wrapCss('input-button-small', buttonStyles({...props, size: 'small'}));
