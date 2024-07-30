import svgr from "esbuild-plugin-svgr"
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  // minify: false,
  sourcemap: true,
  bundle: true,
  clean: true,
  // treeshake: true,
  external: [
    "react",
    "react-dom",
    "@ory/client-helpers",
    "next/image",
    "next/navigation",
    "next/link",
  ],
  format: ["cjs", "esm"],
  /* @ts-ignore -- the types of the plugin are wrong? it still works.. */
  esbuildPlugins: [svgr()],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    }
  },
})
