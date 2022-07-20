import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import dts from "rollup-plugin-dts";
import {eslint} from "rollup-plugin-eslint";

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
    },
    {
      file: packageJson.types,
      format: 'es'
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    dts(),
    // loads postcss config file
    postcss(),
/*    eslint({
      exclude: ['src/styles/!**', "themes/!**", "node_modules/!**", "src/components/!**"],
    }),*/
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      declarations: true,
      tsconfigOverride: {
        include: ['src']
      }
    })
  ]
};
