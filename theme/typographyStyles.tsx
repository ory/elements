import { Theme } from './index'

export const typographyH1Styles = () => `
font-family: 'Rubik', sans-serif;
`

export const typographyH2Styles = () => `
font-family: 'Rubik', sans-serif;
`

export const typographyH3Styles = () => `
font-family: 'Rubik', sans-serif;
`

// @jfcurran where is this being used? I think it should be renamed because
// it resembles the `<body>` but I would assume the `<body>` style to equal the
// `<p>` style.
export const typographyBodyStyles = () => `
font-family: 'Rubik', sans-serif;
`

export const typographyParagraphStyles = () => `
font-family: 'Rubik', sans-serif;
`

export const typographyCodeStyles = () => `
font-family: 'Rubik', sans-serif;
`

export const typographyCaptionStyles = () => `
font-family: 'Rubik', sans-serif;
`

export const typographyLinkStyles = () => `
font-family: 'Rubik', sans-serif;

&:visited,
&.fake-visited {
  color: green;
}

&:hover,
&.fake-hover {
  color: yellow;
}

&:active,
&.fake-active {
  color: red;
}
`
