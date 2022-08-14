import { BuildOptions, defineConfig, LibraryOptions, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const libraryCommon: LibraryOptions = {
    entry: resolve(__dirname, 'src/react.ts'),
    name: 'ory/themes',
    fileName: (format) => `index.${format}.js`
  };

  const buildCommon: Partial<BuildOptions> = {
    minify: 'esbuild',
    sourcemap: true
  };

  /* WARNING: Vanilla Extract does not support the latest Vite (3.x) version yet.*/
  const commonPlugins = [
    vanillaExtractPlugin(),
    dts({ insertTypesEntry: true })
  ];

  const reactRollupOptions: Partial<BuildOptions> = {
    rollupOptions: {
      treeshake: 'recommended',
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  };

  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.VITE_MODE === 'react') {
    return {
      plugins: [react(), ...commonPlugins],
      build: {
        ...buildCommon,
        lib: {
          ...libraryCommon
        },
        ...reactRollupOptions
      }
    };
  } else if (env.VITE_MODE === 'preact') {
    console.log('PREACT MODE');
    return {
      build: {
        ...buildCommon,
        lib: {
          ...libraryCommon
        },
        rollupOptions: {
          external: ['preact'],
          output: {
            globals: {
              preact: 'preact'
            }
          }
        }
      },
      esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
      },
      plugins: [preact(), ...commonPlugins]
    };
  } else if (env.VITE_MODE === 'markdown') {
    console.log('MARDOWN MODE');
    return {
      plugins: [
        react(),
        vanillaExtractPlugin(),
        dts({ insertTypesEntry: true })
      ],
      build: {
        ...buildCommon,
        lib: {
          name: 'ory/themes',
          fileName: (format) => `index.${format}.js`,
          entry: resolve(__dirname, 'src/markdown.ts')
        },
        rollupOptions: {
          treeshake: 'recommended',
          external: ['react', 'react-dom/server', 'express'],
          output: {
            globals: {
              express: 'express',
              react: 'React',
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
