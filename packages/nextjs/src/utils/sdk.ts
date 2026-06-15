// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { get } from "psl"

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
      "You need to set environment variable `NEXT_PUBLIC_ORY_SDK_URL` to your Ory Network SDK URL.",
    )
  }

  return baseUrl
}

export function isProduction() {
  const env = getEnv("VERCEL_ENV") || getEnv("NODE_ENV") || ""
  return ["production", "prod"].indexOf(env) > -1
}

/**
 * Two origins are the same site when their hostnames are equal or share the
 * same registrable domain (eTLD+1). Cookies scoped to the registrable domain
 * are visible to both, so the app can talk to Ory directly without proxying.
 */
function isSameSite(originA: string, originB: string): boolean {
  let hostA: string
  let hostB: string
  try {
    hostA = new URL(originA).hostname
    hostB = new URL(originB).hostname
  } catch {
    return false
  }

  if (hostA === hostB) {
    return true
  }

  // get() returns null for IP addresses, single-label hosts (localhost), and
  // hostnames that are themselves a public suffix (e.g. *.vercel.app, which
  // is on the Public Suffix List, making sibling deployments cross-site).
  const domainA = get(hostA)
  const domainB = get(hostB)
  return Boolean(domainA && domainB && domainA === domainB)
}

export function guessPotentiallyProxiedOrySdkUrl(options?: {
  knownProxiedUrl?: string
}) {
  // The origin the user is actually visiting, derived from the request
  // headers (server) or the browser location. This is ground truth and beats
  // any environment-based guessing, which can disagree with it (e.g.
  // VERCEL_URL on a preview deployment served under a custom domain).
  const visitedOrigin =
    options?.knownProxiedUrl ??
    (typeof window !== "undefined" ? window.location.origin : undefined)

  const sdkUrl = orySdkUrlOrNull()

  if (visitedOrigin && sdkUrl && isSameSite(visitedOrigin, sdkUrl)) {
    // The app and the Ory SDK URL share a site (e.g. a custom domain next to
    // an Ory custom domain on the same registrable domain). Cookies are
    // first-party either way, so no proxying is needed.
    return sdkUrl
  }

  if (isProduction()) {
    if (getEnv("VERCEL_ENV")) {
      const productionUrl = getEnv("VERCEL_PROJECT_PRODUCTION_URL") || ""
      if (productionUrl.indexOf("vercel.app") > -1) {
        // This is a production deployment on Vercel without a custom domain, so we use the vercel app domain.
        return `https://${productionUrl}`.replace(/\/$/, "")
      }
    }

    // In production, we use the production custom domain
    return orySdkUrl()
  }

  if (visitedOrigin) {
    // Cross-site (or no SDK URL configured): route Ory traffic through the
    // visited origin so the proxy middleware can make cookies first-party —
    // anchored to the host the user is on, not the deployment's generated URL.
    return visitedOrigin.replace(/\/$/, "")
  }

  // No request or browser context available — fall back to environment-based
  // guessing.
  if (getEnv("VERCEL_ENV")) {
    // We are in vercel

    // The domain name of the generated deployment URL. Example: *.vercel.app
    // This is only available for preview deployments on Vercel.
    if (getEnv("VERCEL_URL")) {
      return `https://${getEnv("VERCEL_URL")}`.replace(/\/$/, "")
    }

    // This is sometimes set by the render server.
    if (process.env["__NEXT_PRIVATE_ORIGIN"]) {
      return process.env["__NEXT_PRIVATE_ORIGIN"].replace(/\/$/, "")
    }
  }

  // We tried everything. Let's use the SDK URL.
  const final = orySdkUrl()
  console.warn(
    `Unable to determine a suitable SDK URL for setting up the Next.js integration of Ory Elements. Will proceed using default Ory SDK URL "${final}". This is likely not what you want for local development and your authentication and login may not work.`,
  )

  return final
}
