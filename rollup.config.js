import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import';
import {resolve as res} from "path";

const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    postcss({
      extract: res('lib/css/assets.css'),
      sourceMap: 'inline',
      plugins: [
        postcssImport({
          path: 'src/css'
        })
      ]
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        include: ['src']
      }
    })
  ]
};
