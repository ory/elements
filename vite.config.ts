import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';
import path, { resolve } from 'path';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  /* WARNING: Vanilla Extract does not support the latest Vite (3.x) version yet.*/
  const commonPlugins = [
    vanillaExtractPlugin(),
    dts({ insertTypesEntry: true })
  ];

  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.VITE_MODE === 'react') {
    return {
      esbuild: {
        minify: true
      },
      plugins: [
        vanillaExtractPlugin(),
        dts({
          tsConfigFilePath: 'tsconfig.build.json',
          insertTypesEntry: true,
          noEmitOnError: true,
          skipDiagnostics: false,
          logDiagnostics: true
        }),
        react()
      ],
      build: {
        target: 'esnext',
        lib: {
          name: '@ory/themes',
          entry: path.resolve(__dirname, 'src/react.ts'),
          formats: ['es', 'umd'],
          fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.umd.js')
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          outputs: {
            global: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react-dom/server': 'ReactDOMServer'
            }
          }
        }
      }
    };
  } else if (env.VITE_MODE === 'preact') {
    console.log('PREACT MODE');
    return {
      build: {
        minify: 'esbuild',
        sourcemap: true,
        lib: {
          name: '@ory/themes',
          entry: path.resolve(__dirname, 'src/react.ts'),
          formats: ['es', 'umd'],
          fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.umd.js')
        }
      },
      plugins: [
        vanillaExtractPlugin(),
        dts({ insertTypesEntry: true }),
        preact()
      ],
      rollupOptions: {
        external: ['preact']
      },
      commonjsOptions: {
        esmExternals: ['preact']
      },
      // rollupOptions: {
      //   external: ['react', 'react-dom'],
      //   output: {
      //     globals: {
      //       react: 'React',
      //       'react-dom': 'ReactDOM',
      //       'react-dom/server': 'ReactDOMServer'
      //     }
      //   }
      // },
      esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
      }
    };
  } else if (env.VITE_MODE === 'markdown') {
    console.log('MARDOWN MODE');
    return {
      plugins: [
        vanillaExtractPlugin(),
        dts({ insertTypesEntry: true }),
        react()
      ],
      build: {
        minify: 'esbuild',
        sourcemap: true,
        lib: {
          name: '@ory/themes',
          entry: path.resolve(__dirname, 'src/markdown.ts'),
          formats: ['es', 'umd'],
          fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.umd.js')
        },
        rollupOptions: {
          treeshake: 'recommended',
          external: ['react', 'react-dom/server', 'express'],
          output: {
            globals: {
              express: 'express',
              react: 'React',
              'react-dom': 'ReactDOM',
              'react-dom/server': 'ReactDOMServer'
            }
          }
        }
      }
    };
  } else {
    return {};
  }
});
