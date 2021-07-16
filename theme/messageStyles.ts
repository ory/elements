import {
  codeBoxStyles,
  ThemeProps,
  typographyH3Styles,
  wrapCss
} from './index';

export const messageStyles = (props: ThemeProps) => `
  ${typographyH3Styles(props)}
  color: ${props.theme.red60};
  border: 1px solid ${props.theme.red30};
  border-radius: ${props.theme.borderRadius};
  padding: 10px;
  text-align: center;
  margin-bottom: 32px;
`;

export const cssMessageStyles = (props: ThemeProps) =>
  wrapCss('message', messageStyles(props));
