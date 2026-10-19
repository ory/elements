// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * This function returns the base URL of the Ory SDK as set by environment variables `NEXT_PUBLIC_ORY_SDK_URL` or `ORY_SDK_URL`.
 */
export function orySdkUrl() {
  let baseUrl

  if (process.env.NEXT_PUBLIC_ORY_SDK_URL) {
    baseUrl = process.env.NEXT_PUBLIC_ORY_SDK_URL
  }

  if (process.env.ORY_SDK_URL) {
    baseUrl = process.env.ORY_SDK_URL
  }

  if (!baseUrl) {
    throw new Error(
      "[@ory/elements-react] The Ory SDK URL is not set. Set the environment variable `NEXT_PUBLIC_ORY_SDK_URL`, or `ORY_SDK_URL` if you don't use Next.js, to the URL of your Ory project, for example `https://<slug>.projects.oryapis.com`. See https://www.ory.com/docs/elements/guides/configuration#base-url",
    )
  }

  return baseUrl.replace(/\/$/, "")
}

/**
 * This function returns whether the current environment is a production environment.
 */
export function isProduction() {
  return (
    ["production", "prod"].indexOf(
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "",
    ) > -1
  )
}

/**
 * This function returns the Ory SDK URL. If the environment is not production, it tries to guess the SDK URL based on the environment variables, assuming
 * that Ory APIs are proxied through the same domain as the application.
 *
 * Currently, this is only tested for Vercel deployments.
 *
 * @param options - Options for guessing the SDK URL.
 */
export function guessPotentiallyProxiedOrySdkUrl(options?: {
  knownProxiedUrl?: string
}) {
  if (isProduction()) {
    // In production, we use the production custom domain
    return orySdkUrl()
  }

  if (process.env.VERCEL_ENV) {
    // We are in vercel

    // The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://.
    //
    // This is only available for preview deployments on Vercel.
    if (!isProduction() && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "")
    }

    // This is sometimes set by the render server.
    if (process.env.__NEXT_PRIVATE_ORIGIN) {
      return process.env.__NEXT_PRIVATE_ORIGIN.replace(/\/$/, "")
    }
  }

  // Unable to figure out the SDK URL. Either because we are not using Vercel or because we are on a local machine.
  // Let's try to use the window location.
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (options?.knownProxiedUrl) {
    return options.knownProxiedUrl
  }

  // We tried everything. Let's use the SDK URL.
  const final = orySdkUrl()
  console.warn(
    `[@ory/elements-react] Unable to determine the URL this application is served on. Requests go directly to the Ory SDK URL "${final}", so the browser does not send Ory's cookies unless the application runs on the same site and login may not work. In Next.js, add the middleware from \`@ory/nextjs/middleware\`. See https://www.ory.com/docs/getting-started/integrate-auth/nextjs-app-router-quickstart`,
  )

  return final
}
