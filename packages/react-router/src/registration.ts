// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryProxyState } from "@ory/ssr"
import { isTrustedOrigin } from "@ory/ssr/proxy"

// The `.` and `./proxy` entries are separate bundles, so module state is not shared between them.
const registrationKey = Symbol.for("@ory/react-router/proxy")

type Registration = { readonly trustedOrigins: ReadonlyArray<string> }

export function registerProxy(
  trustedOrigins: ReadonlyArray<string>,
): ReadonlyArray<string> {
  const registration: Registration = Object.freeze({
    trustedOrigins: Object.freeze([...trustedOrigins]),
  })
  ;(globalThis as Record<symbol, unknown>)[registrationKey] = registration
  return registration.trustedOrigins
}

function registration(): Registration | null {
  const value: unknown = (globalThis as Record<symbol, unknown>)[
    registrationKey
  ]
  if (typeof value !== "object" || value === null) {
    return null
  }
  const { trustedOrigins } = value as { trustedOrigins?: unknown }
  if (
    !Array.isArray(trustedOrigins) ||
    !trustedOrigins.every((entry) => typeof entry === "string")
  ) {
    return null
  }
  return { trustedOrigins }
}

export function proxyState(origin: string): OryProxyState {
  const registered = registration()
  if (!registered) {
    return "absent"
  }
  return isTrustedOrigin(origin, registered.trustedOrigins)
    ? "trusted-origin"
    : "untrusted-origin"
}
