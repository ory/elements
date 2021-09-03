import { ThemeProps, typographyButtonStyles, wrapCss } from './index';

export interface LinkButtonStyles extends ThemeProps {
  big?: boolean;
  disabled?: boolean;
}

export const linkButtonStyles = ({ big, theme }: LinkButtonStyles) => `
box-sizing: border-box;
  
& .linkButton {
  box-sizing: border-box;
  
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

& .linkButton.disabled, & .linkButton.disabled:hover {
  color: ${theme.grey30};
  background-color: ${theme.grey10};
  cursor: not-allowed;
  pointer-events: all !important;
}

& .linkButton.fake-hover,
& .linkButton:hover {
  background-color: ${theme.primary30};
}

& .linkButton.fake-focus,
& .linkButton:focus {
  background-color: ${theme.primary60};
  border: 2px solid ${theme.blue30};
  outline: none;
}

& .linkButton.fake-click,
& .linkButton:active {
  background-color: ${theme.primary70};
  outline: none;
  border: 2px solid transparent;
}

& a {
  &:hover,
  &,
  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
    ${typographyButtonStyles({ theme })}
    display: inline-block;
    text-align: center;
    font-weight: 400;
  }
}
`;

export const cssLinkButtonStyles = (props: ThemeProps) =>
  wrapCss('input-linkButton', linkButtonStyles(props));

export const cssLinkButtonStylesBig = (props: ThemeProps) =>
  wrapCss('input-linkButton-big', linkButtonStyles({ ...props, big: true }));
