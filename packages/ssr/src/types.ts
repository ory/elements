// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * The parts of an incoming request that `@ory/ssr` reads. A standard
 * `Request` satisfies it.
 *
 * @public
 */
export type OryRequest = {
  /**
   * The full URL of the request, including the query string.
   */
  url: string | URL
  /**
   * The request headers. The `cookie` header is forwarded to Ory.
   */
  headers: Headers
}

/**
 * Query parameters as frameworks expose them. A repeated parameter is an
 * array.
 *
 * @public
 */
export type QueryParams = { [key: string]: string | string[] | undefined }

/**
 * The result of fetching a flow: the flow, or the URL the browser must be
 * redirected to.
 *
 * @public
 */
export type FlowResult<T> = { flow: T } | { redirectTo: string }

/**
 * The result of {@link resolveFlow}.
 *
 * `restart` is `true` when the redirect starts a new flow or continues with a
 * replacement flow, and `false` when Ory requires the browser to go somewhere
 * else, for example to the login page before changing settings.
 *
 * `flow` is the parsed flow, or the error body of a validation error.
 *
 * @public
 */
export type FlowResolution<T> =
  | { flow: T | void }
  | { redirectTo: string; restart: boolean }
