// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Gets environment variable, prioritizing the NEXT_PUBLIC_ prefixed version
 */
function getEnv(name: string): string | undefined {
  return process.env[`NEXT_PUBLIC_${name}`] || process.env[name]
}

function orySdkUrlOrNull(): string | null {
  const baseUrl = getEnv("ORY_SDK_URL")
  return baseUrl ? baseUrl.replace(/\/$/, "") : null
}

export function orySdkUrl() {
  const baseUrl = orySdkUrlOrNull()

  if (!baseUrl) {
    throw new Error(
      "[@ory/nextjs] The Ory SDK URL is not set. Set the environment variable `NEXT_PUBLIC_ORY_SDK_URL` to the URL of your Ory project, for example `https://<slug>.projects.oryapis.com`, in `.env.local` and in your deployment. See https://www.ory.com/docs/getting-started/integrate-auth/nextjs-app-router-quickstart",
    )
  }

  return baseUrl
}
