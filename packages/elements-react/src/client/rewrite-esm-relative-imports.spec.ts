// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { spawnSync } from "node:child_process"
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { rewriteEsmRelativeImports } from "./rewrite-esm-relative-imports"

function nodeRun(file: string) {
  return spawnSync(process.execPath, [file], {
    encoding: "utf8",
    timeout: 5000,
  })
}

describe("rewriteEsmRelativeImports", () => {
  it("adds .mjs to the extensionless frontendClient import from issue #573", () => {
    const input = `import { frontendClient } from "./frontendClient";\n`
    expect(rewriteEsmRelativeImports(input)).toBe(
      `import { frontendClient } from "./frontendClient.mjs";\n`,
    )
  })

  it("adds .mjs to session-provider re-exports from the ESM client entry", () => {
    const input = `import {
  SessionProvider
} from "./session-provider";
import { useSession } from "./useSession";
`
    const output = rewriteEsmRelativeImports(input)
    expect(output).toContain(`from "./session-provider.mjs"`)
    expect(output).toContain(`from "./useSession.mjs"`)
  })

  it("does not double-append extensions", () => {
    const input = `import { frontendClient } from "./frontendClient.mjs";\n`
    expect(rewriteEsmRelativeImports(input)).toBe(input)
  })

  it("leaves package specifiers alone", () => {
    const input = `import { Session } from "@ory/client-fetch";\n`
    expect(rewriteEsmRelativeImports(input)).toBe(input)
  })
})

describe("Node ESM resolution (issue #573)", () => {
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "ory-elements-esm-"))
    writeFileSync(
      path.join(dir, "frontendClient.mjs"),
      "export function frontendClient() { return 1 }\n",
    )
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it("throws ERR_MODULE_NOT_FOUND for extensionless relative imports", () => {
    writeFileSync(
      path.join(dir, "index.mjs"),
      `import { frontendClient } from "./frontendClient";\nconsole.log(frontendClient())\n`,
    )
    const result = nodeRun(path.join(dir, "index.mjs"))
    expect(result.status).not.toBe(0)
    expect(result.stderr).toMatch(/ERR_MODULE_NOT_FOUND/)
    expect(result.stderr).toMatch(/frontendClient/)
  })

  it("resolves after rewriteEsmRelativeImports adds .mjs", () => {
    const broken = `import { frontendClient } from "./frontendClient";\nconsole.log(frontendClient())\n`
    writeFileSync(
      path.join(dir, "index.mjs"),
      rewriteEsmRelativeImports(broken),
    )
    const result = nodeRun(path.join(dir, "index.mjs"))
    expect(result.status).toBe(0)
    expect(result.stderr).not.toMatch(/ERR_MODULE_NOT_FOUND/)
    expect(result.stdout).toMatch(/1/)
  })
})

describe("dist/client ESM build", () => {
  const distClient = path.join(__dirname, "../../dist/client")

  function relativeSpecifiers(source: string): string[] {
    const specs: string[] = []
    const re = /\b(?:from\s+|import\s*\(\s*)(['"])(\.[^'"]+)\1/g
    let match: RegExpExecArray | null
    while ((match = re.exec(source))) {
      specs.push(match[2])
    }
    return specs
  }

  it("emits relative imports with .mjs extensions so Node ESM can resolve them", () => {
    const files = readdirSync(distClient).filter(
      (name) => name.endsWith(".mjs") && !name.endsWith(".map"),
    )
    expect(files).toEqual(
      expect.arrayContaining([
        "index.mjs",
        "session-provider.mjs",
        "frontendClient.mjs",
      ]),
    )

    const missingExtension: string[] = []
    const missingFile: string[] = []

    for (const file of files) {
      const source = readFileSync(path.join(distClient, file), "utf8")
      for (const spec of relativeSpecifiers(source)) {
        if (!path.extname(spec)) {
          missingExtension.push(`${file} imports ${spec}`)
          continue
        }
        const resolved = path.resolve(distClient, spec)
        if (!files.includes(path.basename(resolved))) {
          missingFile.push(`${file} imports ${spec}`)
        }
      }
    }

    expect(missingExtension).toEqual([])
    expect(missingFile).toEqual([])
  })
})
