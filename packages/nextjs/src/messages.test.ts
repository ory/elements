// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readdirSync, readFileSync } from "fs"
import { join, relative } from "path"

const prefix = "[@ory/nextjs] "

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return sourceFiles(path)
    }
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : []
  })
}

// Matches the opening of the message literal of a thrown error or a console
// call, up to the end of the prefix it is expected to carry.
const messageStart =
  /(?:new Error\(|console\.(?:warn|error)\()\s*["'`]([^"'`]{0,16})/g

const messages = sourceFiles(__dirname).flatMap((file) =>
  [...readFileSync(file, "utf8").matchAll(messageStart)].map(
    (match) => [relative(__dirname, file), match[1]] as const,
  ),
)

it("finds the messages emitted by the package", () => {
  expect(messages.length).toBeGreaterThanOrEqual(5)
})

it.each(messages)(
  "prefixes the message in %s starting with %j",
  (_file, start) => {
    expect(start.startsWith(prefix)).toBe(true)
  },
)
