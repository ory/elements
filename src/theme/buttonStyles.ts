import { ThemeProps, typographyButtonStyles, wrapCss } from './index';

export interface ButtonStyles extends ThemeProps {
  big?: boolean;
  disabled?: boolean;
}

export const buttonStyles = ({ big, theme }: ButtonStyles) => `
${typographyButtonStyles({ theme })}

& .button {
  line-height: ${!big ? '20px' : '30px'};
  color: ${theme.grey0};
  border-radius: ${theme.borderRadius};
  
  width: 100%;
  
  padding: 5px 12px;
  margin: 7px 0;
  border: 2px solid transparent;
  outline: none;
  
  background-color: ${theme.primary60};
 
  cursor: pointer;
}

& .button:disabled, & .button:hover:disabled {
  color: ${theme.grey30};
  background-color: ${theme.grey10};
}

& .button.fake-hover,
& .button:hover {
  background-color: ${theme.primary30};
}

& .button.fake-focus,
& .button:focus {
  background-color: ${theme.primary60};
  border: 2px solid ${theme.blue30};
  outline: none;
}

& .button.fake-click,
& .button:active {
  background-color: ${theme.primary70};
  outline: none;
  border: 2px solid transparent;
}
`;

export const cssButtonStyles = (props: ThemeProps) =>
  wrapCss('input-button', buttonStyles(props));

export const cssButtonStylesBig = (props: ThemeProps) =>
  wrapCss('input-button-big', buttonStyles({ ...props, big: true }));
