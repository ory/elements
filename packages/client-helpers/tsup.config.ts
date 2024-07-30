import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  clean: true,
  treeshake: true,
  format: ["cjs", "esm"],
})
