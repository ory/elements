// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export async function publishedVersions(name: string): Promise<string[]> {
  const response = await fetch(
    `https://registry.npmjs.org/${name.replace("/", "%2f")}`,
    { headers: { accept: "application/vnd.npm.install-v1+json" } },
  )
  if (response.status === 404) {
    return []
  }
  if (!response.ok) {
    throw new Error(`Fetching ${name} from npm failed: ${response.status}`)
  }
  const body = (await response.json()) as { versions: Record<string, unknown> }
  return Object.keys(body.versions)
}
