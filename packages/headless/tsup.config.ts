import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "@ory/client-helpers", "@ory/client-fetch"],
  format: ["cjs", "esm"],
})
