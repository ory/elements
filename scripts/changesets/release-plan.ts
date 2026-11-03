// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import semver from "semver"

export type Release = {
  version: string
  distTag: "latest" | "next"
  gitTag: string
  alreadyPublished: boolean
}

const unversioned = "0.0.0"

const baseVersion = (version: string) =>
  `${semver.major(version)}.${semver.minor(version)}.${semver.patch(version)}`

export function releaseTag(name: string, version: string): string {
  return `release/${name}/v${version}`
}

export function distTag(version: string): "latest" | "next" {
  return semver.prerelease(version) ? "next" : "latest"
}

export function assertReleased(
  name: string,
  version: string,
  publishedVersions: string[],
): void {
  if (version !== unversioned && !publishedVersions.includes(version)) {
    throw new Error(
      `${name}@${version} is not on npm. Publish the merged release first, or set package.json to the version on npm.`,
    )
  }
}

export function stableRelease(
  name: string,
  version: string,
  publishedVersions: string[],
): Release | null {
  const alreadyPublished = publishedVersions.includes(version)
  if (version === unversioned) {
    return null
  }
  if (semver.prerelease(version)) {
    if (alreadyPublished) {
      return null
    }
    throw new Error(
      `${name}@${version} is a prerelease and cannot be released to latest.`,
    )
  }
  return {
    version,
    distTag: "latest",
    gitTag: releaseTag(name, version),
    alreadyPublished,
  }
}

export type ManifestRevision = { sha: string; version?: string }

export function releaseCommit(
  history: Iterable<ManifestRevision>,
  version: string,
): string {
  let commit: string | undefined
  for (const revision of history) {
    if (revision.version !== version) {
      if (commit) {
        return commit
      }
      throw new Error(`${version} is not the version at ${revision.sha}.`)
    }
    commit = revision.sha
  }
  if (!commit) {
    throw new Error("The manifest has no commits.")
  }
  return commit
}

export function releaseNotes(changelog: string, version: string): string {
  const lines = changelog.split("\n")
  const start = lines.findIndex(
    (line) => line === `## ${version}` || line.startsWith(`## ${version} `),
  )
  if (start === -1) {
    return ""
  }
  const body = lines.slice(start + 1)
  const end = body.findIndex((line) => line.startsWith("## "))
  return (end === -1 ? body : body.slice(0, end)).join("\n").trim()
}

export function nextPrereleaseVersion(
  computed: string,
  publishedVersions: string[],
): string {
  const [identifier, number] = semver.prerelease(computed) ?? []
  if (typeof identifier !== "string" || typeof number !== "number") {
    throw new Error(`${computed} is not a <version>-<id>.<n> prerelease.`)
  }
  const base = baseVersion(computed)
  const taken = publishedVersions
    .filter((version) => semver.valid(version))
    .filter((version) => baseVersion(version) === base)
    .map((version) => semver.prerelease(version))
    .filter((pre) => pre?.[0] === identifier && typeof pre[1] === "number")
    .map((pre) => Number(pre?.[1]))
  if (taken.length === 0) {
    return computed
  }
  return `${base}-${identifier}.${Math.max(number, ...taken.map((n) => n + 1))}`
}

type DependencyField =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies"

export type PlannedManifest = {
  name: string
  version: string
} & Partial<Record<DependencyField, Record<string, string>>>

const runtimeDependencyFields: DependencyField[] = [
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
]

export function unpublishedDependencies(
  plan: PlannedManifest[],
  workspaceVersions: Record<string, string>,
  publishedByPackage: Record<string, string[]>,
): string[] {
  const released = new Set(plan.map(({ name }) => name))
  return plan.flatMap((manifest) =>
    runtimeDependencyFields
      .flatMap((field) => Object.entries(manifest[field] ?? {}))
      .filter(([, spec]) => spec.startsWith("workspace:"))
      .map(([name]) => name)
      .filter(
        (name) =>
          !released.has(name) &&
          !publishedByPackage[name]?.includes(workspaceVersions[name]),
      )
      .map(
        (name) =>
          `${manifest.name}@${manifest.version} depends on ${name}@${workspaceVersions[name]}, which is not on npm and not part of this release.`,
      ),
  )
}
