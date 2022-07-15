import {
  pxToRem, variations,
  ThemeProps,
  typographyCaptionStyles,
  typographyH3Styles,
  wrapCss
} from './index';

export interface TextInputProps {
  help?: boolean;
  state?: 'success' | 'error' | 'disabled' | 'active';
  variation?: variations
}

type ColorFunc = (props: ThemeProps & TextInputProps) => string;

const textColorForState: ColorFunc = ({ state, theme }) => {
  switch (state) {
    case 'success':
      return `color: ${theme.palettes.light.success.emphasis};`;
    case 'error':
      return `color: ${theme.palettes.light.error.emphasis};`;
  }
  return '';
};

const borderColorForState: ColorFunc = ({ state, theme }) => {
  switch (state) {
    case 'disabled':
      return theme.palettes.light.border.disabled;
    case 'success':
      return theme.palettes.light.success.emphasis;
    case 'active':
      return theme.palettes.light.accent.emphasis;
    case 'error':
      return theme.palettes.light.error.emphasis;
  }
  return theme.palettes.light.border.def;
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
  const {theme, state, help} = props;
  const size = props.variation || 'medium';
  
  let css = `
  box-sizing: border-box;
  
  /* We use custom text definitions it breaks React Native form inputs: */
  font-family: ${theme.typography.input[size].fontFamily};
  font-weight: ${theme.typography.input[size].fontWeight};
  font-style: ${theme.typography.input[size].fontStyle};
  font-size: ${theme.typography.input[size].fontSize};
  
  color: ${state === 'disabled' ? theme.palettes.light.input.disabled : theme.palettes.light.input.placeholder};
  
  width: 100%;
  padding: ${pxToRem(16, 24)};
  
  padding: ${size === 'small' ? pxToRem(8, 16) : size === 'medium' ? pxToRem(12, 24) : pxToRem(16, 24)};
  
  min-height: ${pxToRem(size === 'large' ? 64 : size === 'small' ? 40 : 48)};
  
  border: 1px solid ${borderColorForState(props)};
  border-radius: ${theme.inputs.borderRadius};
  
  background-color: inherit;
  overflow: visible;
`;

  if (theme.platform !== 'react-native') {
    css += `
  outline: none;
  
  &.fake-hover,
  &:hover {
    cursor: caret;
  }
  
  &.fake-focus,
  &:focus {
    border: 1px solid ${theme.palettes.light.accent.emphasis};
    color: ${theme.palettes.light.input.text};
  }
`;
  }

  return css;
};

export const cssTextInputStyles = (props: ThemeProps) =>
  wrapCss('text-input', textInputStyles(props));
