import { Theme } from './index';

const defaultTypography = (sheet: string) => ({ theme }: { theme: Theme }) => `
text-rendering: geometricPrecision; 
font-family: ${theme.fontFamily};
font-style: normal;
font-weight: normal;
${sheet}
`;

export const typographyH1Styles = defaultTypography(`
font-weight: 500;
font-size: 32px;
line-height: 40px;
`);

export const typographyH2Styles = defaultTypography(`
font-size: 16px;
line-height: 24px;
`);

export const typographyH3Styles = defaultTypography(`
font-size: 14px;
line-height: 20px;
`);

export const typographyLeadStyles = defaultTypography(`
font-weight: 300;
font-size: 16px;
line-height: 24px;
`);

export const typographyParagraphStyles = defaultTypography(`
font-weight: 300;
font-size: 14px;
line-height: 20px;
`);

export const typographyButtonStyles = defaultTypography(`
font-weight: 300;
font-size: 14px;
line-height: 20px;
`);

export const typographyCodeStyles = defaultTypography(`
font-family: Roboto Mono;
font-size: 14px;
line-height: 20px;
`);

export const typographyCaptionStyles = defaultTypography(`
font-weight: 300;
font-size: 12px;
line-height: 18px;
`);

export const typographyLinkStyles = ({ theme }: { theme: Theme }) => `
${defaultTypography('')({ theme })}
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
