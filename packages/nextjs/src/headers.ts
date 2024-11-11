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
  "user-agent",
  "referer",
]

export const defaultOmitHeaders = [
  "transfer-encoding",
  "content-encoding",
  "content-length",
]
