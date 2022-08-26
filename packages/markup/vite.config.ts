import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [vanillaExtractPlugin(), dts({ insertTypesEntry: true }), react()],
    build: {
      minify: 'esbuild',
      sourcemap: true,
      lib: {
        name: '@ory/elements',
        entry: path.resolve(__dirname, '../../src/markup.ts'),
        formats: ['es', 'umd'],
        fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.umd.js')
      },
      rollupOptions: {
        treeshake: 'recommended',
        external: ['express'],
        output: {
          globals: {
            express: 'express'
          }
        }
      }
    }
  });
