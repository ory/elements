import {
  messageStyles,
  ThemeProps,
  typographyCaptionStyles,
  typographyH3Styles,
  wrapCss
} from './index';

export interface TextInputProps {
  help?: boolean;
  state?: 'success' | 'error' | 'disabled';
}

type ColorFunc = (props: ThemeProps & TextInputProps) => string;

const textColorForState: ColorFunc = ({ state, theme }) => {
  switch (state) {
    case 'success':
      return `color: ${theme.green60};`;
    case 'error':
      return `color: ${theme.red60};`;
  }
  return '';
};

const borderColorForState: ColorFunc = ({ state, theme }) => {
  switch (state) {
    case 'disabled':
      return 'transparent';
    case 'success':
      return theme.green60;
    case 'error':
      return theme.red60;
  }
  return theme.grey30;
};

const backgroundColorForState: ColorFunc = ({ state, theme }) => {
  switch (state) {
    case 'disabled':
      return theme.grey10;
  }
  return 'transparent';
};

export const textInputTitleStyles: ColorFunc = (props) => `
  ${typographyH3Styles(props)}
  ${textColorForState(props)}
`;

export const cssTextInputTitleStyles = (props: ThemeProps) =>
  wrapCss('text-input-title', textInputTitleStyles(props));

export const textInputSubtitleStyles: ColorFunc = (props) => `
  ${typographyCaptionStyles(props)}
  ${textColorForState(props)}
  margin-bottom: 15px;
`;
export const cssTextInputSubtitleStyles = (props: ThemeProps) =>
  wrapCss('text-input-subtitle', textInputSubtitleStyles(props));

export const textInputStyles: ColorFunc = (props) => {
  const { theme, help, state } = props;

  let css = `
  box-sizing: border-box;
    
  /* We use custom text definitions it breaks React Native form inputs: */
  font-family: ${props.theme.regularFont300};
  font-weight: 300;
  font-style: normal;
  font-size: 14px;
  
  color: ${state === 'disabled' ? theme.grey30 : theme.grey70}; 

  width: 100%;
  padding: 5px 12px;
  
  margin-top: 7px;
  margin-bottom: ${!help ? '14px' : '7px'};
  
  border: 1px solid ${borderColorForState(props)};
  border-radius: ${theme.borderRadius};
  
  background-color: ${backgroundColorForState(props)};
  overflow: visible;
`;

  if (theme.platform !== 'react-native') {
    css += `
  outline: none;

  &.fake-hover,
  &:hover {
    border: 1px solid ${theme.primary30};
  }

  &.fake-focus,
  &:focus {
    border: 1px solid ${theme.primary60};
  }
`;
  }

  return css;
};

export const cssTextInputStyles = (props: ThemeProps) =>
  wrapCss('text-input', textInputStyles(props));
