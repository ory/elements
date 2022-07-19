import { ButtonStyles } from './buttonStyles';
import { pxToRem, ThemeProps, typographyButtonStyles, wrapCss } from './index';

export interface SocialButtonStyles extends ThemeProps {
  disabled?: boolean;
  brand: string;
  size?: 'small' | 'medium' | 'large';
}

export const socialButtonStyles = ({ theme, size }: ButtonStyles) => {
  size = size || 'medium';
  return `
  
& .button {
  ${typographyButtonStyles({ theme }, size)}
  color: ${theme.palettes.light.foreground.muted};
  border-radius: ${theme.buttons.borderRadius};
  
  width: 100%;
  min-height: ${pxToRem(size === 'large' ? 64 : size === 'small' ? 40 : 48)};
  
  border: 1px solid ${theme.palettes.light.foreground.muted};
  padding: ${
    size === 'small' || size === 'medium' ? pxToRem(10, 16) : pxToRem(16, 24)
  };
  outline: none;
  
  background-color: inherit;
 
  cursor: pointer;
  display: flex;
}

& .button:disabled, & .button:hover:disabled {
  color: ${theme.palettes.light.foreground.disabled};
}

& .button.fake-hover,
& .button:hover {
  color: ${theme.palettes.light.foreground.subtle};
}

& .button.fake-focus,
& .button:focus {
  background-color: ${theme.palettes.light.accent.def};
  border-color: ${theme.palettes.light.accent.muted};
  outline: none;
}

& .button.fake-click,
& .button:active {
  color: ${theme.palettes.light.foreground.onDark};
  background-color: ${theme.palettes.light.accent.def};
  outline: none;
}

& .button-text {
  margin: auto;
}

`;
};

export const cssSocialButtonStyles = (props: SocialButtonStyles) =>
  wrapCss(
    'input-social-button',
    socialButtonStyles({ ...props, size: 'medium' })
  );

export const cssSocialButtonStylesSmall = (props: SocialButtonStyles) =>
  wrapCss(
    'input-social-button-small',
    socialButtonStyles({ ...props, size: 'small' })
  );

export const cssSocialButtonStylesLarge = (props: SocialButtonStyles) =>
  wrapCss(
    'input-social-button-large',
    socialButtonStyles({ ...props, size: 'large' })
  );
