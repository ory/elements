import {
  ThemeProps,
  typographyH3Styles,
  typographyParagraphStyles,
  wrapCss
} from './index';

export const checkboxStyles = ({ theme }: ThemeProps) => `
margin-bottom: 14px;
  
& .checkbox-title {
  ${typographyH3Styles({ theme })};
  color: ${theme.grey70};
  display: block;
  margin-bottom: 6px;
}

& .checkbox-subtitle {
  margin-top: 7px;
}

& .checkbox-inner {
  display: flex;
}

& input[type="checkbox"] {
  display: none;
}

& input[type="checkbox"] + label {
  position: relative;
  display: flex;
}

& input[type="checkbox"] + label::before {
  min-width: 12px;
  min-height: 12px;
  max-width: 12px;
  max-height: 12px;
  width: 12px;
  height: 12px;
  
  content: "";
  
  border: 1px solid ${theme.grey10};
  margin-top: 2px;
}

& input[type="checkbox"]:checked+label::before {
  background-color: ${theme.primary60};
  
  color: ${theme.grey0};
}

& input[type="checkbox"] + label svg {
  position: absolute;
  fill: ${theme.grey0};
  left: 3px;
  top: 5px;
}

& label span {
  ${typographyParagraphStyles({ theme })}
  
  display: block;
  margin-left: 16px;
}
`;

export const cssCheckboxStyles = (props: ThemeProps) =>
  wrapCss('checkbox', checkboxStyles(props));
