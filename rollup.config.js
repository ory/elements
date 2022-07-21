import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import dts from "rollup-plugin-dts";
import {eslint} from "rollup-plugin-eslint";
import esbuild from 'rollup-plugin-esbuild'
import {vanillaExtractPlugin} from "@vanilla-extract/rollup-plugin";
import postcssImport from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tailwindNesting from "tailwindcss/nesting";
import babel from 'rollup-plugin-babel';
import * as path from "path";

const packageJson = require('./package.json');

const helperPlugins = [
  peerDepsExternal(),
  postcss({
    extensions: ['.css'],
    extract: true,
    modules: true,
    minimize: true,
    sourceMap: 'inline',
    plugins: [
      postcssImport({
        extract: 'lib/assets/assets.css',
      }),
      postcssUrl({
        url: 'inline'
      }),
      tailwindcss({path: './tailwind.config.js'}),
      tailwindNesting(),
      autoprefixer(),
      cssnano()
    ]
  }),
  resolve({
    rootDir: 'src',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),

]

const ts = {
  input: 'src/index.ts',
  preserveModules: true,
  output: [
    {
      dir: 'lib',
      format: 'es',
      assetFileNames: 'assets/[name][extname]',
    }
  ],
  plugins: [
    ...helperPlugins,
    dts(),
    vanillaExtractPlugin(),
    babel({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
      exclude: ['node_modules/**', '.storybook/**'],
      presets: ["solid", "@babel/preset-typescript"],
      extensions: ['src/**/*.js', '.jsx', '.ts', '.tsx'],
    }),
    // loads postcss config file
    // excludes node_modules by default
    /*    eslint({
      exclude: ['src/styles/!**', "themes/!**", "node_modules/!**", "src/components/!**"],
    }),*/
  ]
}

const js = {
  input: 'src/index.ts',
  presets: ["solid"],
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
    ...helperPlugins,
    commonjs(),
    esbuild()
  ],
}

export default [js, ts];
