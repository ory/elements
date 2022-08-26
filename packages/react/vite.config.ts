import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import dts from "vite-plugin-dts"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    dts({
      insertTypesEntry: true,
    }),
    react(),
  ],
  build: {
    target: "esnext",
    lib: {
      name: "@ory/elements",
      entry: path.resolve(__dirname, "../../src/react.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
    },
    rollupOptions: {
      treeshake: "smallest",
      external: ["react", "react-dom"],
    },
  },
})
