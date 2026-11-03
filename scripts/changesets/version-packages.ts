// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { assertReleased } from "./release-plan.ts"
import {
  assertDependenciesPublished,
  publicPackages,
  readManifest,
  run,
} from "./workspace.ts"

const packages = await publicPackages()
for (const { manifest, published } of packages) {
  assertReleased(manifest.name, manifest.version, published)
}
console.log(run("pnpm", ["exec", "changeset", "version"]))

const bumped = []
for (const pkg of packages) {
  const { version } = await readManifest(pkg.manifestPath)
  if (version !== pkg.manifest.version) {
    bumped.push(pkg.manifest.name)
  }
}
await assertDependenciesPublished(packages, bumped)
