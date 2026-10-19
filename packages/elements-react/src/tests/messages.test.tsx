// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { renderHook } from "@testing-library/react"
import { readdirSync, readFileSync } from "fs"
import { join, relative } from "path"
import { useOryFlow } from "../context"

const src = join(__dirname, "..")
const prefix = "[@ory/elements-react] "

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return ["locales", "tests", "__tests__", "__test__"].includes(entry.name)
        ? []
        : sourceFiles(path)
    }
    return /\.tsx?$/.test(entry.name) &&
      !/\.(test|spec)\.tsx?$/.test(entry.name)
      ? [path]
      : []
  })
}

// Matches the opening of the message literal of a thrown error or a console
// call, up to the end of the prefix it is expected to carry.
const messageStart =
  /(?:new Error\(|new ResponseError\(\s*\w+,|console\.(?:warn|error|debug)\()\s*["'`]([^"'`]{0,24})/g

const messages = sourceFiles(src).flatMap((file) =>
  [...readFileSync(file, "utf8").matchAll(messageStart)].map(
    (match) => [relative(src, file), match[1]] as const,
  ),
)

test("should find the messages emitted by the package", () => {
  expect(messages.length).toBeGreaterThan(20)
})

test.each(messages)(
  "should prefix the message in %s starting with %j",
  (_file, start) => {
    expect(start.startsWith(prefix)).toBe(true)
  },
)

test("should name an exported provider when useOryFlow has no provider", () => {
  jest.spyOn(console, "error").mockImplementation(() => {})

  expect(() => renderHook(() => useOryFlow())).toThrow(
    "[@ory/elements-react] useOryFlow must be used inside <OryProvider>",
  )
})

test("should not name providers that the package does not export", () => {
  for (const file of sourceFiles(src)) {
    expect(readFileSync(file, "utf8")).not.toMatch(
      /within an? (OryFlowProvider|ComponentProvider)/,
    )
  }
})
