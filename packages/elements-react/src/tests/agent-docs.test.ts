/**
 * @jest-environment node
 */
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { existsSync, mkdtempSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { join, relative } from "path"
import {
  agentDocs,
  checkAgentDocs,
  extractSnippets,
  packageRootOf,
} from "../../scripts/agent-docs"

const packageRoot = packageRootOf(__filename)
const docs = agentDocs(packageRoot)

jest.setTimeout(180_000)

function markdownFile(content: string) {
  const file = join(mkdtempSync(join(tmpdir(), "agent-docs-")), "GUIDE.md")
  writeFileSync(file, content)
  return file
}

test("should ship a guide and a skill", () => {
  expect(docs.map((file) => relative(packageRoot, file))).toEqual([
    "agents/GUIDE.md",
    "skills/customize-ory-elements/SKILL.md",
  ])
  for (const file of docs) {
    expect(existsSync(file)).toBe(true)
  }
})

test("should type-check every TypeScript block of the bundled agent docs", () => {
  expect(checkAgentDocs(docs)).toEqual([])
})

test("should require a file name on every TypeScript block", () => {
  expect(() => extractSnippets("```ts\nconst a = 1\n```\n")).toThrow(
    "has to start with a `// path/to/file.ts` comment",
  )
})

test("should extract blocks fenced with more than three backticks up to the matching fence", () => {
  const markdown = [
    "````tsx",
    "// app/page.tsx",
    "```",
    "export const a = 1",
    "````",
  ].join("\n")

  expect(extractSnippets(markdown)).toEqual([
    {
      file: "app/page.tsx",
      code: "// app/page.tsx\n```\nexport const a = 1",
      line: 2,
    },
  ])
})

test("should report identifiers and imports that the packages do not have", () => {
  const problems = checkAgentDocs([
    markdownFile(
      [
        "```tsx",
        "// app/login.tsx",
        'import { OryFlowComponentOverrides } from "@ory/elements-react"',
        'import { ThemeProvider } from "@ory/elements-react/theme"',
        'import { getLoginFlow } from "@ory/nextjs/app"',
        'import { createOryMiddleware } from "@ory/elements/nextjs"',
        'import "@ory/elements-react/styles.css"',
        "",
        "export const overrides: OryFlowComponentOverrides = {",
        "  Card: { CardHeader: () => null },",
        "}",
        "export const flow = getLoginFlow({})",
        "export { ThemeProvider, createOryMiddleware }",
        "```",
      ].join("\n"),
    ),
  ]).join("\n")

  expect(problems).toContain("'CardHeader' does not exist")
  expect(problems).toContain("no exported member 'ThemeProvider'")
  expect(problems).toContain("Expected 2 arguments, but got 1")
  expect(problems).toContain("Cannot find module '@ory/elements/nextjs'")
  expect(problems).toContain(
    '"@ory/elements-react/styles.css" is not an export of the package',
  )
})

test("should resolve the @/ alias to the blocks of the same document", () => {
  expect(
    checkAgentDocs([
      markdownFile(
        [
          "```ts",
          "// ory.config.ts",
          "export default { name: 1 }",
          "```",
          "```ts",
          "// lib/use.ts",
          'import config from "@/ory.config"',
          "export const name: number = config.name",
          "```",
        ].join("\n"),
      ),
    ]),
  ).toEqual([])
})
