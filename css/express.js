const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');

const {
  cssButtonStyles,
  cssButtonStylesBig,
  cssCheckboxStyles,
  cssCodeBoxStyles,
  cssForkMeStyles,
  cssForkMeStylesFork,
  cssForkMeStylesImages,
  cssForkMeStylesLink,
  cssForkMeStylesText,
  cssMessageStyles,
  cssTextInputStyles,
  cssTextInputSubtitleStyles,
  cssTextInputTitleStyles,
  cssTypographyButtonStyles,
  cssTypographyCaptionStyles,
  cssTypographyCodeStyles,
  cssTypographyH1Styles,
  cssTypographyH2Styles,
  cssTypographyH3Styles,
  cssTypographyLeadStyles,
  cssTypographyLinkStyles,
  cssTypographyParagraphStyles,
  theme: t
} = require('../lib');
const { cssNormalize } = require('../lib/theme/normalizeStyles');

function cssVars(tt) {
  const result = [];
  for (let [k, v] of Object.entries(tt)) {
    result.push(`  --${k}: ${v};`);
  }
  return result.join('\n');
}

const themeContext = (theme) => {
  if (theme) {
    return { theme: { ...theme, platform: 'react' } };
  }

  return { theme: { ...t, platform: 'react' } };
};

module.exports = {
  expressHandler: function (theme) {
    return function (req, res, next) {
      const ct = themeContext(theme);

      const css = `

:root {
${cssVars(theme || t)}
}
  
${cssNormalize}

${cssButtonStyles(ct)}
${cssButtonStylesBig(ct)}

${cssCheckboxStyles(ct)}

${cssCodeBoxStyles(ct)}

${cssForkMeStylesText(ct)}
${cssForkMeStylesImages(ct)}
${cssForkMeStylesFork(ct)}
${cssForkMeStylesLink(ct)}
${cssForkMeStyles(ct)}

${cssMessageStyles(ct)}

${cssTextInputTitleStyles(ct)}
${cssTextInputSubtitleStyles(ct)}
${cssTextInputStyles(ct)}

${cssTypographyH1Styles(ct)}
${cssTypographyH2Styles(ct)}
${cssTypographyH3Styles(ct)}
${cssTypographyLeadStyles(ct)}
${cssTypographyParagraphStyles(ct)}
${cssTypographyButtonStyles(ct)}
${cssTypographyCodeStyles(ct)}
${cssTypographyCaptionStyles(ct)}
${cssTypographyLinkStyles(ct)}
  `;

      res.header('Content-Type', 'text/css');

      postcss([
        postcssPresetEnv({
          stage: 0,
          features: {
            'nesting-rules': true
          }
        })
      ])
        .process(css, { from: 'src/theme.css', to: 'lib/theme.css' })
        .then((result) => {
          res.send(result.css);
        });
    };
  }
};
