// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

function getEnv(name: string): string | undefined {
  return typeof process === "undefined" ? undefined : process.env[name]
}

export function orySdkUrl(): string {
  const sdkUrl = getEnv("ORY_SDK_URL")
  if (!sdkUrl) {
    throw new Error(
      "[@ory/react-router] The Ory SDK URL is not set. Set the environment variable `ORY_SDK_URL` to the URL of your Ory project, for example `https://<slug>.projects.oryapis.com`, in `.env` and in your deployment. See https://www.ory.com/docs/getting-started/integrate-auth/react-router-quickstart",
    )
  }
  return sdkUrl.replace(/\/$/, "")
}

export function oryProjectApiKey(): string | undefined {
  return getEnv("ORY_PROJECT_API_TOKEN") || undefined
}
