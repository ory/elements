import {ThemeProps, typographyButtonStyles, wrapCss} from './index';

export interface ButtonStyles extends ThemeProps {
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const buttonStyles = ({theme, size}: ButtonStyles) => {
  size = size || 'medium';
  return `
${typographyButtonStyles({theme}, size)}

& .button {
  color: ${theme.palettes.light.text.def};
  border-radius: ${theme.cards.borderRadius};
  
  width: 100%;
  height: ${size === 'large' ? '64px' : size === 'small' ? '40px' : '48px'};
  
  border: 4px solid transparent;
  padding: ${size === 'large' || size === 'medium' ? '16px 24px' : '10px 16px'};
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
`;
}

export const cssButtonStyles = (props: ThemeProps) =>
  wrapCss('input-button', buttonStyles({...props, size: 'medium'}));

export const cssButtonStylesLarge = (props: ThemeProps) =>
  wrapCss('input-button-large', buttonStyles({...props, size: 'large'}));

export const cssButtonStylesSmall = (props: ThemeProps) =>
  wrapCss('input-button-small', buttonStyles({...props, size: 'small'}));
