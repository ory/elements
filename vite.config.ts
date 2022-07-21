import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {vanillaExtractPlugin} from "@vanilla-extract/vite-plugin";
import dts from 'vite-plugin-dts';
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vanillaExtractPlugin(), react(), dts({insertTypesEntry: true})],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ory/themes',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "storybook"],
      output: {
        globals: {
          storybook: "storybook",
          react: "React",
          "react-dom": "ReactDOM",
        }
      }
    }
  }
})
