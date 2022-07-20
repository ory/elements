import { ThemeProps, wrapCss } from './index';

const geometricPrecision = ({ theme }: ThemeProps) =>
  theme.platform === 'react-native'
    ? ''
    : `text-rendering: geometricPrecision;
`;

export const typographyH1Styles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.typography.h1.fontFamily};
font-weight: ${props.theme.typography.h1.fontWeight};
font-style: ${props.theme.typography.h1.fontStyle};
font-size: ${props.theme.typography.h1.fontSize};
line-height: ${props.theme.typography.h1.lineHeight};
`;

export const cssTypographyH1Styles = (props: ThemeProps) =>
  wrapCss('typography-h1', typographyH1Styles(props));

export const typographyH2Styles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.typography.h2.fontFamily};
font-weight: ${props.theme.typography.h2.fontWeight};
font-style: ${props.theme.typography.h2.fontStyle};
font-size: ${props.theme.typography.h2.fontSize};
line-height: ${props.theme.typography.h2.lineHeight};
`;

export const cssTypographyH2Styles = (props: ThemeProps) =>
  wrapCss('typography-h2', typographyH2Styles(props));

export const typographyH3Styles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.typography.h3.fontFamily};
font-weight: ${props.theme.typography.h3.fontWeight};
font-style: ${props.theme.typography.h3.fontStyle};
font-size: ${props.theme.typography.h3.fontSize};
line-height: ${props.theme.typography.h3.lineHeight};

& .required {
  color: ${props.theme.palettes.light.accent.def};
}
`;

export const cssTypographyH3Styles = (props: ThemeProps) =>
  wrapCss('typography-h3', typographyH3Styles(props));

export const typographyLeadStyles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont300};
font-weight: 300;
font-style: normal;
font-size: 16px;
line-height: 24px;
`;

export const cssTypographyLeadStyles = (props: ThemeProps) =>
  wrapCss('typography-lead', typographyLeadStyles(props));

export const typographyParagraphStyles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.typography.paragraph.fontFamily};
font-weight: ${props.theme.typography.paragraph.fontWeight};
font-style: ${props.theme.typography.paragraph.fontStyle};
font-size: ${props.theme.typography.paragraph.fontSize};
line-height: ${props.theme.typography.paragraph.lineHeight};
`;

export const cssTypographyParagraphStyles = (props: ThemeProps) =>
  wrapCss('typography-paragraph', typographyParagraphStyles(props));

export const typographyButtonStyles = (
  props: ThemeProps,
  size?: 'small' | 'medium' | 'large'
) => {
  size = size || 'medium';
  return `
${geometricPrecision(props)}
font-family: ${props.theme.typography.button[size].fontFamily};
font-weight: ${props.theme.typography.button[size].fontWeight};
font-style: ${props.theme.typography.button[size].fontStyle};
font-size: ${props.theme.typography.button[size].fontSize};
line-height: ${props.theme.typography.button[size].lineHeight};
`;
};

export const cssTypographyButtonStyles = (props: ThemeProps) =>
  wrapCss('typography-button', typographyButtonStyles(props));

export const typographyCodeStyles = ({ theme }: ThemeProps) => `
${geometricPrecision({ theme })}
font-family: ${theme.codeFont400};
font-weight: 400;
font-style: normal;
font-size: 14px;
line-height: 20px;

color: ${theme.grey0}
`;

export const cssTypographyCodeStyles = (props: ThemeProps) =>
  wrapCss('typography-code', typographyCodeStyles(props));

export const typographyCaptionStyles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont300};
font-weight: 300;
font-style: normal;
font-size: 12px;
line-height: 18px;
margin-bottom: 14px;
`;

export const cssTypographyCaptionStyles = (props: ThemeProps) =>
  wrapCss('typography-caption', typographyCaptionStyles(props));

export const typographyLinkStyles = ({ theme }: ThemeProps) => {
  let css = `${geometricPrecision({ theme })}
font-family: ${theme.regularFont300};

font-size: 12px;
line-height: 18px;

text-decoration: none;

color: ${theme.primary60};
`;

  if (theme.platform !== 'react-native') {
    css += `
&.fake-visited,
&:visited {
  color: ${theme.primary70};
}

&.fake-hover,
&:hover {
  color: ${theme.primary30};
}
&.fake-active,
&:active {
  color: ${theme.primary70};
}
`;
  }

  return css;
};

export const cssTypographyLinkStyles = (props: ThemeProps) =>
  wrapCss('typography-link', typographyLinkStyles(props));
