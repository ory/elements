import { ThemeProps } from './index';

const geometricPrecision = ({ theme }: ThemeProps) =>
  theme.platform === 'react-native'
    ? ''
    : `text-rendering: geometricPrecision;
`;

export const typographyH1Styles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont500};
font-weight: 500;
font-style: normal;
font-size: 32px;
line-height: 40px;
`;

export const typographyH2Styles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont400};
font-weight: 400;
font-style: normal;
font-size: 16px;
line-height: 24px;
`;

export const typographyH3Styles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont400};
font-weight: 400;
font-style: normal;
font-size: 14px;
line-height: 20px;
`;

export const typographyLeadStyles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont300};
font-weight: 300;
font-style: normal;
font-size: 16px;
line-height: 24px;
`;

export const typographyParagraphStyles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont300};
font-weight: 300;
font-style: normal;
font-size: 14px;
line-height: 20px;
`;

export const typographyButtonStyles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont300};
font-weight: 300;
font-style: normal;
font-size: 14px;
line-height: 20px;
`;

export const typographyCodeStyles = ({ theme }: ThemeProps) => `
${geometricPrecision({ theme })}
font-family: ${theme.codeFont400};
font-weight: 400;
font-style: normal;
font-size: 14px;
line-height: 20px;

color: ${theme.grey0}
`;

export const typographyCaptionStyles = (props: ThemeProps) => `
${geometricPrecision(props)}
font-family: ${props.theme.regularFont300};
font-weight: 300;
font-style: normal;
font-size: 12px;
line-height: 18px;
`;

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
