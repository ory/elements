// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { get } from "psl"

import { parseOrigin } from "../url"

const docsLink =
  "https://www.ory.com/docs/elements/guides/configuration#trusted-origins"

const patternShape = /^(https?:\/\/)([^/:]+)(:\d+)?\/?$/

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function compilePattern(entry: string): RegExp | null {
  const shape = patternShape.exec(entry)
  if (!shape) {
    return null
  }
  const [, scheme, host, port = ""] = shape
  const sampleHost = host.split("*").join("a")
  const sample = scheme + sampleHost + port
  const labels = host.split(".")
  if (parseOrigin(sample) !== sample || labels.includes("")) {
    return null
  }

  const registrable = get(sampleHost)
  if (!registrable) {
    return null
  }
  const registrableIndex = labels.length - registrable.split(".").length
  if (
    labels[registrableIndex] === "*" ||
    labels.slice(registrableIndex + 1).some((label) => label.includes("*"))
  ) {
    return null
  }

  const hostPattern = labels
    .map((label) => label.split("*").map(escapeRegExp).join("[a-z0-9-]+"))
    .join("\\.")
  return new RegExp(
    "^" + escapeRegExp(scheme) + hostPattern + escapeRegExp(port) + "$",
  )
}

type Matcher = (origin: string) => boolean

function compileEntry(entry: string): Matcher | null {
  if (!entry.includes("*")) {
    const exact = parseOrigin(entry)
    return exact === null ? null : (origin) => origin === exact
  }
  const pattern = compilePattern(entry)
  return pattern === null ? null : (origin) => pattern.test(origin)
}

/**
 * Throws a `TypeError` when `trustedOrigins` is missing or empty, or when an
 * entry is not an origin without a path.
 *
 * An entry with `*` in the host is a glob. Each `*` matches one or more of
 * `[a-z0-9-]` and never a dot. The label right before the public suffix, from
 * the Public Suffix List, must not be only `*`, and the public suffix must not
 * contain `*`.
 *
 * @param trustedOrigins - The configured entries.
 * @param packageName - The package that prefixes the error, for example `@ory/nextjs`.
 * @internal
 */
export function checkTrustedOrigins(
  trustedOrigins: ReadonlyArray<string> | undefined,
  packageName: string,
): void {
  if (!trustedOrigins || trustedOrigins.length === 0) {
    throw new TypeError(
      `[${packageName}] \`trustedOrigins\` is not configured. Set it to the origins this deployment serves, such as \`http://localhost:3000\`. Use \`*\` in the host to match several origins, such as \`https://my-app-*-my-team.vercel.app\`. See ${docsLink}`,
    )
  }
  for (const entry of trustedOrigins) {
    if (typeof entry !== "string") {
      throw new TypeError(
        `[${packageName}] \`trustedOrigins\` accepts only strings. Replace ${String(entry)} with an origin such as \`http://localhost:3000\`, or one with \`*\` in the host such as \`https://my-app-*-my-team.vercel.app\`. See ${docsLink}`,
      )
    }
    if (!compileEntry(entry)) {
      throw new TypeError(
        `[${packageName}] The \`trustedOrigins\` entry "${entry}" is not a valid origin. Use an origin without a path, such as \`http://localhost:3000\`. To match several origins, use \`*\` in the host, such as \`https://my-app-*-my-team.vercel.app\`. A \`*\` can't make up the whole label right before a public suffix such as \`vercel.app\` or \`com\`. See ${docsLink}`,
      )
    }
  }
}

/**
 * Returns true when the origin is a valid origin and matches an entry of the
 * configured allowlist. Exact entries match scheme, host, and port; a
 * trailing slash is ignored. See {@link checkTrustedOrigins} for globs.
 *
 * @internal
 */
export function isTrustedOrigin(
  origin: string,
  trustedOrigins: ReadonlyArray<string>,
): boolean {
  const parsed = parseOrigin(origin)
  if (parsed === null) {
    return false
  }
  return trustedOrigins.some((entry) => {
    const matches = typeof entry === "string" ? compileEntry(entry) : null
    return matches !== null && matches(parsed)
  })
}
