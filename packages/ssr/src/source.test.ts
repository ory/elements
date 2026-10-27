// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readdirSync, readFileSync } from "fs"
import { join, relative } from "path"

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return sourceFiles(path)
    }
    return /\.ts$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)
      ? [path]
      : []
  })
}

const files = sourceFiles(__dirname).map(
  (file) => [relative(__dirname, file), readFileSync(file, "utf8")] as const,
)

const messageStart =
  /(?:new Error\(|console\.(?:warn|error)\()\s*["'`]([^"'`]{0,11})/g

const messages = files.flatMap(([file, source]) =>
  [...source.matchAll(messageStart)].map((match) => [file, match[1]] as const),
)

it("finds the messages emitted by the package", () => {
  expect(messages.length).toBeGreaterThanOrEqual(2)
})

it.each(messages)(
  "prefixes the message in %s starting with %j",
  (_file, start) => {
    expect(start).toBe("[@ory/ssr] ")
  },
)

it.each(files)(
  "does not read the environment, the window, or Node globals in %s",
  (_file, source) => {
    expect(source).not.toMatch(
      /\bprocess\.|\bwindow\b|\bBuffer\b|from "(next|react)\b/,
    )
  },
)
