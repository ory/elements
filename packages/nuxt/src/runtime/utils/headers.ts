// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Headers that should be omitted from the upstream response
 */
export const defaultOmitHeaders = [
  "transfer-encoding",
  "content-encoding",
  "content-length",
]

/**
 * Headers that are allowed to be forwarded to Ory
 */
const allowedHeaders = [
  "accept",
  "accept-language",
  "content-type",
  "cookie",
  "user-agent",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-real-ip",
]

/**
 * Filter request headers to only include allowed headers
 */
export function filterRequestHeaders(
  headers: Headers,
  additionalHeaders?: string[],
): Headers {
  const filteredHeaders = new Headers()
  const allowed = [...allowedHeaders, ...(additionalHeaders || [])]

  headers.forEach((value, key) => {
    if (allowed.includes(key.toLowerCase())) {
      filteredHeaders.set(key, value)
    }
  })

  return filteredHeaders
}
