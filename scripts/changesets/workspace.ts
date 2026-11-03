// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { execFileSync } from "node:child_process"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { publishedVersions } from "./registry.ts"
import {
  type ManifestRevision,
  type PlannedManifest,
  releaseCommit,
  unpublishedDependencies,
} from "./release-plan.ts"

export type Manifest = PlannedManifest & { private?: boolean }

export type PublicPackage = {
  dir: string
  manifestPath: string
  manifest: Manifest
  published: string[]
}

export const root = path.resolve(import.meta.dirname, "../..")

export const run = (command: string, args: string[]) =>
  execFileSync(command, args, { cwd: root, encoding: "utf8" })

export const readManifest = async (file: string) =>
  JSON.parse(await readFile(file, "utf8")) as Manifest

export const writeJSON = (file: string, value: unknown) =>
  writeFile(file, `${JSON.stringify(value, null, 2)}\n`)

const lines = (output: string) => output.split("\n").filter(Boolean)

function* manifestHistory(manifest: string): Generator<ManifestRevision> {
  const log = run("git", [
    "log",
    "--first-parent",
    "--format=%H",
    "--",
    manifest,
  ])
  for (const sha of lines(log)) {
    const content = run("git", ["show", `${sha}:./${manifest}`])
    yield {
      sha,
      version: (JSON.parse(content) as { version?: string }).version,
    }
  }
}

export const releaseCommitOf = (pkg: PublicPackage) =>
  releaseCommit(
    manifestHistory(path.join(pkg.dir, "package.json")),
    pkg.manifest.version,
  )

export const commitsOldestFirst = (paths: string[]) =>
  lines(
    run("git", [
      "rev-list",
      "--first-parent",
      "--reverse",
      "HEAD",
      "--",
      ...paths,
    ]),
  )

export async function publicPackages(): Promise<PublicPackage[]> {
  const packages: PublicPackage[] = []
  for (const dir of await readdir(path.join(root, "packages"))) {
    const manifestPath = path.join(root, "packages", dir, "package.json")
    const manifest = await readManifest(manifestPath).catch(() => null)
    if (manifest && !manifest.private) {
      packages.push({
        dir: path.join("packages", dir),
        manifestPath,
        manifest,
        published: await publishedVersions(manifest.name),
      })
    }
  }
  return packages
}

export async function assertDependenciesPublished(
  packages: PublicPackage[],
  released: string[],
): Promise<void> {
  const manifests = await Promise.all(
    packages.map((pkg) => readManifest(pkg.manifestPath)),
  )
  const unpublished = unpublishedDependencies(
    manifests.filter(({ name }) => released.includes(name)),
    Object.fromEntries(manifests.map(({ name, version }) => [name, version])),
    Object.fromEntries(
      packages.map((pkg) => [pkg.manifest.name, pkg.published]),
    ),
  )
  if (unpublished.length > 0) {
    throw new Error(
      [
        ...unpublished,
        "Add a changeset for each dependency above, or publish it and set its package.json version to the one on npm.",
      ].join("\n"),
    )
  }
}
