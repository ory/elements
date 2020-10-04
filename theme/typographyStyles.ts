import { ThemeProps } from './index';
import {
  typographyH1Styles as nativeTypographyH1Styles,
  typographyH2Styles as nativeTypographyH2Styles,
  typographyH3Styles as nativeTypographyH3Styles,
  typographyLeadStyles as nativeTypographyLeadStyles,
  typographyParagraphStyles as nativeTypographyParagraphStyles,
  typographyButtonStyles as nativeTypographyButtonStyles,
  typographyCodeStyles as nativeTypographyCodeStyles,
  typographyCaptionStyles as nativeTypographyCaptionStyles,
  typographyLinkStyles as nativeTypographyLinkStyles
} from './native/typographyStyles';

const defaultTypography = ({ theme }: ThemeProps) => `
text-rendering: geometricPrecision; 
font-family: ${theme.fontFamily};
`;

export const typographyH1Styles = (props: ThemeProps) => `
${defaultTypography(props)}
${nativeTypographyH1Styles}
`;

export const typographyH2Styles = (props: ThemeProps) => `
${defaultTypography(props)}
${nativeTypographyH2Styles}
`;

export const typographyH3Styles = (props: ThemeProps) => `
${defaultTypography(props)}
${nativeTypographyH3Styles}
`;

export const typographyLeadStyles = (props: ThemeProps) => `
${defaultTypography(props)}
${nativeTypographyLeadStyles()}
`;

export const typographyParagraphStyles = (props: ThemeProps) => `
${defaultTypography(props)}
${nativeTypographyParagraphStyles()}
`;

export const typographyButtonStyles = (props: ThemeProps) => `
${defaultTypography(props)}
${nativeTypographyButtonStyles()}
`;

export const typographyCodeStyles = ({ theme }: ThemeProps) => `
${defaultTypography({ theme })}
${nativeTypographyCodeStyles({ theme })}
font-family: "Roboto Mono";
`;

export const typographyCaptionStyles = (props: ThemeProps) => `
${defaultTypography(props)}
${nativeTypographyCaptionStyles()}
font-weight: 300;
font-size: 12px;
line-height: 18px;
`;

export const typographyLinkStyles = ({ theme }: ThemeProps) => `
${defaultTypography({ theme })}
${nativeTypographyLinkStyles({ theme })}
font-size: 12px;
line-height: 18px;

text-decoration: none;

color: ${theme.primary60};

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
