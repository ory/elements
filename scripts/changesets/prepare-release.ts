// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"
import {
  assertReleased,
  distTag,
  nextPrereleaseVersion,
  type Release,
  releaseNotes,
  releaseTag,
  stableRelease,
} from "./release-plan.ts"
import {
  assertDependenciesPublished,
  type PublicPackage,
  publicPackages,
  readManifest,
  releaseCommitOf,
  root,
  run,
  writeJSON,
} from "./workspace.ts"

const { values: args } = parseArgs({
  options: {
    out: { type: "string" },
    prerelease: { type: "string" },
  },
})
if (!args.out) {
  throw new Error(
    "Usage: prepare-release.ts --out <plan.json> [--prerelease <id>]",
  )
}
const out = path.resolve(args.out)

type PlannedRelease = Release & { name: string; dir: string; notes: string }

const changelogPath = (pkg: PublicPackage) =>
  path.join(root, pkg.dir, "CHANGELOG.md")

const readChangelog = (pkg: PublicPackage) =>
  readFile(changelogPath(pkg), "utf8").catch(() => "")

async function stablePlan(packages: PublicPackage[]) {
  const head = run("git", ["rev-parse", "HEAD"]).trim()
  const plan: PlannedRelease[] = []
  for (const pkg of packages) {
    const { name, version } = pkg.manifest
    const release = stableRelease(name, version, pkg.published)
    if (release && releaseCommitOf(pkg) === head) {
      const notes = releaseNotes(await readChangelog(pkg), version)
      plan.push({ name, dir: pkg.dir, ...release, notes })
    }
  }
  return plan
}

async function prereleasePlan(packages: PublicPackage[], identifier: string) {
  for (const { manifest, published } of packages) {
    assertReleased(manifest.name, manifest.version, published)
  }
  run("pnpm", ["exec", "changeset", "pre", "enter", identifier])
  run("pnpm", ["exec", "changeset", "version"])

  const plan: PlannedRelease[] = []
  for (const pkg of packages) {
    const manifest = await readManifest(pkg.manifestPath)
    if (manifest.version === pkg.manifest.version) {
      continue
    }
    const version = nextPrereleaseVersion(manifest.version, pkg.published)
    let changelog = await readChangelog(pkg)
    if (version !== manifest.version) {
      await writeJSON(pkg.manifestPath, { ...manifest, version })
      changelog = changelog.replace(
        `## ${manifest.version}\n`,
        `## ${version}\n`,
      )
      await writeFile(changelogPath(pkg), changelog)
    }
    plan.push({
      name: manifest.name,
      dir: pkg.dir,
      version,
      distTag: distTag(version),
      gitTag: releaseTag(manifest.name, version),
      alreadyPublished: pkg.published.includes(version),
      notes: releaseNotes(changelog, version),
    })
  }
  return plan
}

const packages = await publicPackages()
const plan = args.prerelease
  ? await prereleasePlan(packages, args.prerelease)
  : await stablePlan(packages)

await assertDependenciesPublished(
  packages,
  plan.filter((release) => !release.alreadyPublished).map(({ name }) => name),
)

await writeJSON(out, plan)
if (plan.length === 0) {
  console.log("Nothing to release.")
}
for (const release of plan) {
  console.log(
    `${release.name}@${release.version} (${release.distTag})${release.alreadyPublished ? ", already on npm" : ""}`,
  )
}
