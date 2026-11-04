// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

/**
 * Node ESM requires file extensions on relative specifiers. tsup's unbundled
 * client build emits `from "./frontendClient"`; rewrite those to `.mjs`.
 */
export function rewriteEsmRelativeImports(source: string): string {
  return source.replace(
    /\b(from\s+|import\s*\(\s*)(['"])(\.[^'"]+)\2/g,
    (full, prefix: string, quote: string, spec: string) => {
      if (path.extname(spec)) {
        return full
      }
      return `${prefix}${quote}${spec}.mjs${quote}`
    },
  )
}

export function rewriteEsmRelativeImportsInDir(dir: string): void {
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".mjs")) {
      continue
    }
    const file = path.join(dir, name)
    const source = readFileSync(file, "utf8")
    const next = rewriteEsmRelativeImports(source)
    if (next !== source) {
      writeFileSync(file, next)
    }
  }
}
