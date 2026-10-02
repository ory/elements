// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export const defaultForwardedHeaders = [
  "accept",
  "accept-charset",
  "accept-encoding",
  "accept-language",
  "authorization",
  "cache-control",
  "content-type",
  "cookie",
  "host",
  "origin",
  "referer",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-fetch-user",
  "user-agent",
]

export const defaultOmitHeaders = [
  "transfer-encoding",
  "content-encoding",
  "content-length",
]
