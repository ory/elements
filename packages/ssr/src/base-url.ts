// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Attaches the URL the browser uses to reach Ory as `ory_base_url`, which Ory
 * Elements components read in place of `sdk.url`. It is a plain property so
 * that it survives serialization to the client.
 */
export function attachBaseUrl<T extends object>(value: T, baseUrl: string): T {
  return { ...value, ory_base_url: baseUrl }
}
