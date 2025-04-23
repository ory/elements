// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Gets environment variable, prioritizing the NEXT_PUBLIC_ prefixed version
 */
function getEnv(name: string): string | undefined {
  return process.env[`NEXT_PUBLIC_${name}`] || process.env[name]
}

export function orySdkUrl() {
  const baseUrl = getEnv("ORY_SDK_URL")

  if (!baseUrl) {
    throw new Error(
      "You need to set environment variable `NEXT_PUBLIC_ORY_SDK_URL` to your Ory Network SDK URL.",
    )
  }

  return baseUrl.replace(/\/$/, "")
}

export function isProduction() {
  const env = getEnv("VERCEL_ENV") || getEnv("NODE_ENV") || ""
  return ["production", "prod"].indexOf(env) > -1
}

export function guessPotentiallyProxiedOrySdkUrl(options?: {
  knownProxiedUrl?: string
}) {
  if (getEnv("VERCEL_ENV")) {
    // We are in vercel

    // The domain name of the generated deployment URL. Example: *.vercel.app
    // This is only available for preview deployments on Vercel.
    if (!isProduction() && getEnv("VERCEL_URL")) {
      return `https://${getEnv("VERCEL_URL")}`.replace(/\/$/, "")
    }

    const productionUrl = getEnv("VERCEL_PROJECT_PRODUCTION_URL") || ""
    if (isProduction() && productionUrl.indexOf("vercel.app") > -1) {
      // This is a production deployment on Vercel without a custom domain, so we use the vercel app domain.
      return `https://${productionUrl}`.replace(/\/$/, "")
    }

    // This is sometimes set by the render server.
    if (process.env["__NEXT_PRIVATE_ORIGIN"]) {
      return process.env["__NEXT_PRIVATE_ORIGIN"].replace(/\/$/, "")
    }
  }

  if (isProduction()) {
    // In production, we use the production custom domain
    return orySdkUrl()
  }

  // Try to use window location
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (options?.knownProxiedUrl) {
    return options.knownProxiedUrl
  }

  // We tried everything. Let's use the SDK URL.
  const final = orySdkUrl()
  console.warn(
    `Unable to determine a suitable SDK URL for setting up the Next.js integration of Ory Elements. Will proceed using default Ory SDK URL "${final}". This is likely not what you want for local development and your authentication and login may not work.`,
  )

  return final
}
