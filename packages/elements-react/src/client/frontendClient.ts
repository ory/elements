// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
} from "@ory/client-fetch"
import { guessPotentiallyProxiedOrySdkUrl } from "./config"

export function frontendClient(
  {
    forceBaseUrl,
    ...opts
  }: Partial<ConfigurationParameters & { forceBaseUrl?: string }> = {
    credentials: "include",
  },
) {
  const basePath =
    forceBaseUrl ??
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: window.location.origin,
    })

  const config = new Configuration({
    ...opts,
    basePath: basePath?.replace(/\/$/, ""),
    credentials: opts.credentials || "include",
    headers: {
      Accept: "application/json",
      ...opts.headers,
    },
  })
  return new FrontendApi(config)
}
