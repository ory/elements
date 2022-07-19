const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');
const path = require('path');
const fs = require('fs');

const {
  cssButtonStyles,
  cssButtonStylesLarge,
  cssButtonStylesSmall,
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
  cssSocialButtonStyles,
  cssSocialButtonStylesSmall,
  cssSocialButtonStylesLarge,
  cssCardStyles,
  theme: t
} = require('../lib');

const { cssNormalize } = require('../lib');

function cssVars(tt, parent = '', result = []) {
  for (let [k, v] of Object.entries(tt)) {
    let key = k;
    if (parent !== '') {
      key = `${parent}-${k}`;
    }
    if (typeof v === 'string') {
      result.push(`  --${key}: ${v};`);
    } else {
      cssVars(v, key, result);
    }
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
  staticAssets: () => (req, res, next) => {
    res.header('Content-Type', 'text/css');
    res.sendfile(path.join(__dirname, '../lib/css/assets.css'));
  },
  expressHandler: function (theme) {
    return function (req, res, next) {
      const ct = themeContext(theme);

      const css = `

:root {
${cssVars(theme || t)}
}

${cssNormalize}

${cssCardStyles(ct)}

${cssButtonStyles(ct)}
${cssButtonStylesLarge(ct)}
${cssButtonStylesSmall(ct)}

${cssSocialButtonStyles(ct)}
${cssSocialButtonStylesSmall(ct)}
${cssSocialButtonStylesLarge(ct)}

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
