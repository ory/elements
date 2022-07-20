import {ThemeProps, wrapCss} from "./index";

export interface DividerStyles extends ThemeProps {
  width?: string;
  height?: string;
}

export const dividerStyles = ({theme, width, height}: DividerStyles) => `
  background-color: ${theme.palettes.light.border.def};
  border: 4px solid ${theme.palettes.light.border.def};
  width: ${width || '100%'};
  height: ${height || '100%'};
`

export const cssDividerStyles = (props: ThemeProps) =>
  wrapCss('divider', dividerStyles(props));
