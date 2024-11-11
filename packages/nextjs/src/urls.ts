// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function joinUrlPaths(baseUrl: string, relativeUrl: string): string {
  return new URL(relativeUrl, baseUrl).href
}
