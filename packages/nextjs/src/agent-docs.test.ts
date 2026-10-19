// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { existsSync } from "fs"
import { relative } from "path"
import {
  agentDocs,
  checkAgentDocs,
  packageRootOf,
} from "../../elements-react/scripts/agent-docs"

const packageRoot = packageRootOf(__filename)
const docs = agentDocs(packageRoot)

jest.setTimeout(180_000)

it("ships a guide and a skill", () => {
  expect(docs.map((file) => relative(packageRoot, file))).toEqual([
    "agents/GUIDE.md",
    "skills/add-ory-auth-to-nextjs/SKILL.md",
  ])
  for (const file of docs) {
    expect(existsSync(file)).toBe(true)
  }
})

it("type-checks every TypeScript block of the bundled agent docs", () => {
  expect(checkAgentDocs(docs)).toEqual([])
})
