// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import semver from "semver"

export type Change = "none" | "additive" | "breaking"

export type BumpType = "major" | "minor" | "patch" | "none"

type ChangesetRelease = { name: string; type: BumpType }

export type RequiredBump = Exclude<BumpType, "none">

export type BumpRequirement = {
  name: string
  bump: RequiredBump
  reasons: string[]
}

const bumpOrder: BumpType[] = ["none", "patch", "minor", "major"]

const isApiLine = (line: string) => {
  const trimmed = line.trim()
  return !(
    trimmed === "" ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("import ") ||
    trimmed.startsWith("```") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith(">")
  )
}

const hunkHeader = /^@@ [^@]* @@ ?(.*)$/

function changedApiLines(diff: string, sign: "-" | "+"): string[] {
  const lines: string[] = []
  let declaration = ""
  for (const line of diff.split("\n")) {
    const header = hunkHeader.exec(line)
    if (header) {
      declaration = header[1].trim()
    } else if (line.startsWith(sign) && !line.startsWith(sign.repeat(3))) {
      const content = line.slice(1)
      if (!isApiLine(content)) {
        continue
      }
      if (/^\s/.test(content)) {
        lines.push(`${declaration}\n${content.trim()}`)
      } else {
        declaration = content.trim()
        lines.push(declaration)
      }
    }
  }
  return lines
}

export function apiReportChange(diff: string): Change {
  const removed = changedApiLines(diff, "-")
  const added = changedApiLines(diff, "+")
  const addedSet = new Set(added)
  if (removed.some((line) => !addedSet.has(line))) {
    return "breaking"
  }
  const removedSet = new Set(removed)
  return added.some((line) => !removedSet.has(line)) ? "additive" : "none"
}

type SlotsFile = { slots: { path: string }[] }

export function slotsChange(
  base: SlotsFile | null,
  head: SlotsFile | null,
): Change {
  if (JSON.stringify(base) === JSON.stringify(head)) {
    return "none"
  }
  const headPaths = new Set(head?.slots.map((slot) => slot.path) ?? [])
  return base?.slots.some((slot) => !headPaths.has(slot.path))
    ? "breaking"
    : "additive"
}

export function requiredBump(
  change: Change,
  currentVersion: string,
): RequiredBump | null {
  switch (change) {
    case "none":
      return null
    case "additive":
      return "patch"
    case "breaking":
      return semver.major(currentVersion) === 0 ? "minor" : "major"
  }
}

const higher = (a: BumpType, b: BumpType) =>
  bumpOrder.indexOf(a) >= bumpOrder.indexOf(b) ? a : b

export function changesetBumps(
  changesets: ChangesetRelease[][],
): Record<string, BumpType> {
  const bumps: Record<string, BumpType> = {}
  for (const { name, type } of changesets.flat()) {
    bumps[name] = higher(bumps[name] ?? "none", type)
  }
  return bumps
}

export function gateFailures(
  requirements: BumpRequirement[],
  bumps: Record<string, BumpType>,
): string[] {
  return requirements.flatMap(({ name, bump, reasons }) => {
    const found = bumps[name] ?? "none"
    if (found === "none") {
      const kind = bump === "patch" ? "a" : `a ${bump}`
      return [
        `${name} needs ${kind} changeset (${reasons.join(", ")} changed).`,
      ]
    }
    if (higher(found, bump) !== found) {
      return [
        `${name} needs a ${bump} changeset, found ${found} (breaking change in ${reasons.join(", ")}).`,
      ]
    }
    return []
  })
}
