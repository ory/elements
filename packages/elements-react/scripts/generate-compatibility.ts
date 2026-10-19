// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  packagesWithGuide,
  readManifest,
  withCompatibility,
} from "./compatibility"

async function main() {
  for (const packageRoot of packagesWithGuide) {
    const file = join(packageRoot, "agents/GUIDE.md")
    writeFileSync(
      file,
      await withCompatibility(
        readFileSync(file, "utf8"),
        readManifest(packageRoot),
      ),
    )
    console.log(`Wrote ${file}`)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
