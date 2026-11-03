// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { stableRelease } from "./release-plan.ts"
import {
  commitsOldestFirst,
  publicPackages,
  releaseCommitOf,
} from "./workspace.ts"

const packages = await publicPackages()
const commits = new Set<string>()
for (const pkg of packages) {
  const { name, version } = pkg.manifest
  const release = stableRelease(name, version, pkg.published)
  if (release && !release.alreadyPublished) {
    commits.add(releaseCommitOf(pkg))
  }
}

const manifests = packages.map((pkg) => `${pkg.dir}/package.json`)
console.log(
  JSON.stringify(
    commitsOldestFirst(manifests).filter((sha) => commits.has(sha)),
  ),
)
