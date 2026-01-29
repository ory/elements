// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import { Configuration, FrontendApi } from "@ory/client-fetch"
import { useRuntimeConfig } from "#imports"

/**
 * Gets the Ory SDK URL from environment or config
 */
export function orySdkUrl(): string {
  const config = useRuntimeConfig()
  const baseUrl =
    config.public.ory?.sdkUrl ||
    process.env.NUXT_PUBLIC_ORY_SDK_URL ||
    process.env.ORY_SDK_URL

  if (!baseUrl) {
    throw new Error(
      "You need to set environment variable `NUXT_PUBLIC_ORY_SDK_URL` to your Ory Network SDK URL.",
    )
  }

  return baseUrl.replace(/\/$/, "")
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  const env = process.env.NODE_ENV || ""
  return env === "production" || env === "prod"
}

/**
 * Guess the potentially proxied Ory SDK URL
 */
export function guessPotentiallyProxiedOrySdkUrl(options?: {
  knownProxiedUrl?: string
}): string {
  // Try to use window location in browser
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (options?.knownProxiedUrl) {
    return options.knownProxiedUrl
  }

  // In production, use the SDK URL directly
  if (isProduction()) {
    return orySdkUrl()
  }

  // We tried everything. Let's use the SDK URL.
  const final = orySdkUrl()
  console.warn(
    `Unable to determine a suitable SDK URL for setting up the Nuxt integration of Ory Elements. Will proceed using default Ory SDK URL "${final}". This is likely not what you want for local development and your authentication and login may not work.`,
  )

  return final
}

/**
 * Create a server-side Frontend API client
 */
export function createFrontendClient(): FrontendApi {
  return new FrontendApi(
    new Configuration({
      headers: {
        Accept: "application/json",
      },
      basePath: orySdkUrl(),
    }),
  )
}
