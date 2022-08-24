import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  /* WARNING: Vanilla Extract does not support the latest Vite (3.x) version yet.*/
    esbuild: {
      minify: true
    },
    plugins: [
      vanillaExtractPlugin(),
      dts({
        insertTypesEntry: true,
      }),
      react()
    ],
    build: {
      target: 'esnext',
      lib: {
        name: '@ory/themes',
        entry: path.resolve(__dirname, '../../src/react.ts'),
        formats: ['es', 'umd'],
        fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.umd.js')
      }
      // rollupOptions: {
      //   treeshake: 'smallest',
      //   external: ['react', 'react-dom']
      //   outputs: {
      //     global: {
      //       react: 'React',
      //       'react-dom': 'ReactDOM',
      //       'react-dom/server': 'ReactDOMServer'
      //     }
      //   }
      // }
    }
  });
