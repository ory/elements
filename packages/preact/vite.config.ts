import { defineConfig } from "vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import dts from "vite-plugin-dts"
import path from "path"
import preact from "@preact/preset-vite"

export default defineConfig({
  build: {
    minify: "esbuild",
    sourcemap: true,
    lib: {
      name: "@ory/elements",
      entry: path.resolve(__dirname, "../../src/react.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
    },
    rollupOptions: {
      external: ["preact"],
    },
    commonjsOptions: {
      esmExternals: ["preact"],
    },
  },
  plugins: [vanillaExtractPlugin(), dts({ insertTypesEntry: true }), preact()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
})
