// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
  OAuth2Api,
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
    credentials: opts.credentials ?? "include",
    headers: {
      Accept: "application/json",
      ...opts.headers,
    },
  })
  return new FrontendApi(config)
}

export function oauth2Client(
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
    credentials: opts.credentials ?? "include",
    headers: {
      Accept: "application/json",
      ...opts.headers,
    },
  })
  return new OAuth2Api(config)
}
