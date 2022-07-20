import {vanillaExtractPlugin} from '@vanilla-extract/rollup-plugin';
import postcssImport from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import tailwindcss from 'tailwindcss';
import tailwindNesting from 'tailwindcss/nesting';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

module.exports = {
  extract: 'lib/css/assets.css',
  sourceMap: 'inline',
  plugins: [
    // this has to be first
    postcssImport({
      path: 'src/css'
    }),
    // we need this to bundle external urls in css
    postcssUrl({
      url: 'inline'
    }),
    // we need this for our theming css-in-js
    vanillaExtractPlugin(),
    tailwindcss({path: './tailwind.config.js'}),
    tailwindNesting(),
    autoprefixer(),
    // compress the css file
    cssnano({})
  ],
}
