// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import * as markdown from "prettier/plugins/markdown"
import { format } from "prettier/standalone"

const elementsRoot = resolve(__dirname, "../../..")

export const packagesWithGuide = [
  resolve(__dirname, ".."),
  resolve(__dirname, "../../nextjs"),
]

export type Manifest = {
  name: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  ory?: { oel?: string }
}

const start = "<!-- compatibility:start -->"
const end = "<!-- compatibility:end -->"

const pairedPackage = /^(@ory\/|react$|react-dom$|next$)/

export function readManifest(packageRoot: string): Manifest {
  return JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as Manifest
}

function minimumOel(manifest: Manifest) {
  const range = manifest.ory?.oel
  const version = range && /^>=(\d+\.\d+)$/.exec(range)?.[1]
  if (!version) {
    throw new Error(
      `${manifest.name} has to declare the oldest supported OEL release as "ory": { "oel": ">=YY.Q" } in package.json, got ${JSON.stringify(range)}.`,
    )
  }
  return version
}

function ranges(packages: Record<string, string> = {}) {
  return Object.entries(packages)
    .filter(([name]) => pairedPackage.test(name))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, range]) => `- \`${name}\`: \`${range}\``)
}

/**
 * Renders the compatibility section of a package's `agents/GUIDE.md` from its
 * `package.json`.
 */
export function renderCompatibility(manifest: Manifest): string {
  const peers = ranges(manifest.peerDependencies)
  const dependencies = ranges(manifest.dependencies)
  return [
    start,
    "",
    "## Compatibility",
    "",
    "<!-- Generated from package.json by `nx run @ory/elements-react:compatibility`. Do not edit. -->",
    "",
    `This version of \`${manifest.name}\` works with Ory Network and with the Ory Enterprise License (OEL) ${minimumOel(manifest)} or later.`,
    ...(peers.length
      ? [
          "",
          "The application installs these packages itself, in these ranges:",
          "",
          ...peers,
        ]
      : []),
    ...(dependencies.length
      ? [
          "",
          `\`${manifest.name}\` brings these packages. If the application imports one of them itself, use a version in the same range, so that there is a single copy:`,
          "",
          ...dependencies,
        ]
      : []),
    "",
    end,
  ].join("\n")
}

function prettierOptions() {
  const manifest = JSON.parse(
    readFileSync(join(elementsRoot, "package.json"), "utf8"),
  ) as { prettier: Record<string, unknown> }
  return manifest.prettier
}

/**
 * Returns the guide with its compatibility section replaced by the one
 * rendered from the manifest, formatted with the repository's Prettier
 * options.
 */
export async function withCompatibility(
  guide: string,
  manifest: Manifest,
): Promise<string> {
  const from = guide.indexOf(start)
  const to = guide.indexOf(end)
  if (from < 0 || to < from) {
    throw new Error(
      `The guide of ${manifest.name} has to contain the lines ${start} and ${end}.`,
    )
  }
  return format(
    guide.slice(0, from) +
      renderCompatibility(manifest) +
      guide.slice(to + end.length),
    { ...prettierOptions(), parser: "markdown", plugins: [markdown] },
  )
}
