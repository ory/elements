// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { parseChangesetFile } from "@changesets/parse"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { parseArgs } from "node:util"
import {
  apiReportChange,
  type BumpRequirement,
  type Change,
  changesetBumps,
  gateFailures,
  type RequiredBump,
  requiredBump,
  slotsChange,
} from "./changeset-gate.ts"

const { values: args } = parseArgs({
  options: {
    base: { type: "string" },
    head: { type: "string", default: "HEAD" },
  },
})
if (!args.base) {
  throw new Error("Usage: check-changesets.ts --base <rev> [--head <rev>]")
}
const { base, head } = args

const root = path.resolve(import.meta.dirname, "../..")

const git = (...gitArgs: string[]) =>
  execFileSync("git", gitArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  })

const show = (rev: string, file: string) => {
  try {
    return git("show", `${rev}:./${file}`)
  } catch {
    return null
  }
}

const changedFiles = (...pathspec: string[]) =>
  git(
    "diff",
    "--name-only",
    "--no-renames",
    "--relative",
    base,
    head,
    "--",
    ...pathspec,
  )
    .split("\n")
    .filter(Boolean)

const reportFile =
  /^(packages\/[^/]+)\/(api-report\/[^/]+\.api\.md|agents\/slots\.json)$/

function fileChange(file: string): Change {
  if (file.endsWith(".api.md")) {
    return apiReportChange(
      git("diff", "-U0", "--relative", base, head, "--", file),
    )
  }
  const parse = (contents: string | null) =>
    contents === null
      ? null
      : (JSON.parse(contents) as Parameters<typeof slotsChange>[0])
  return slotsChange(parse(show(base, file)), parse(show(head, file)))
}

const bumpRank: RequiredBump[] = ["patch", "minor", "major"]

const requirements = new Map<string, BumpRequirement>()
for (const file of changedFiles("packages")) {
  const match = reportFile.exec(file)
  const manifest = match && show(head, `${match[1]}/package.json`)
  if (!manifest) {
    continue
  }
  const { name, version } = JSON.parse(manifest) as {
    name: string
    version: string
  }
  const change = fileChange(file)
  const bump = requiredBump(change, version)
  if (!bump) {
    continue
  }
  const current = requirements.get(name)
  if (!current || bumpRank.indexOf(bump) > bumpRank.indexOf(current.bump)) {
    requirements.set(name, { name, bump, reasons: [file] })
  } else if (current.bump === bump) {
    current.reasons.push(file)
  }
}

const changesets = changedFiles(".changeset")
  .filter((file) => file.endsWith(".md") && path.basename(file) !== "README.md")
  .map((file) => show(head, file))
  .filter((contents) => contents !== null)
  .map((contents) => parseChangesetFile(contents).releases)

const failures = gateFailures(
  [...requirements.values()],
  changesetBumps(changesets),
)
for (const failure of failures) {
  console.log(process.env.GITHUB_ACTIONS ? `::error::${failure}` : failure)
}
if (failures.length > 0) {
  console.log(
    "Add a changeset with `pnpm exec changeset` that names each package above.",
  )
  process.exit(1)
}
console.log(
  requirements.size === 0
    ? "No API report or slots changes."
    : `Changesets cover ${[...requirements.keys()].join(", ")}.`,
)
