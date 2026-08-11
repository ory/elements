// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns true when the request origin matches an entry of the configured
 * allowlist. String entries match exactly (scheme, host, and port; a trailing
 * slash is ignored). RegExp entries are tested against the origin.
 *
 * @internal
 */
export function isTrustedOrigin(
  origin: string,
  trustedOrigins: ReadonlyArray<string | RegExp>,
): boolean {
  const normalizedOrigin = origin.replace(/\/$/, "")
  return trustedOrigins.some((entry) => {
    if (typeof entry === "string") {
      return entry.replace(/\/$/, "") === normalizedOrigin
    }
    // A g or y flag makes test() stateful via lastIndex; reset it so
    // matching stays deterministic across requests.
    entry.lastIndex = 0
    return entry.test(normalizedOrigin)
  })
}
