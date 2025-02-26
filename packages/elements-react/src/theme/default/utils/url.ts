// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { AuthenticatorAssuranceLevel } from "@ory/client-fetch"

export function restartFlowUrl(
  flow: { request_url?: string; requested_aal?: string; return_to?: string },
  fallback: string,
) {
  if (flow.requested_aal === "aal2")
    return appendRefresh(appendAal(fallback, "aal1"), true)
  return flow.request_url || appendReturnTo(fallback, flow.return_to)
}

export function initFlowUrl(
  sdkUrl: string,
  flowType: string,
  flow: {
    return_to?: string
    oauth2_login_challenge?: string
  },
) {
  const result = `${sdkUrl}/self-service/${flowType}/browser`
  const qs = new URLSearchParams()

  if (flow.oauth2_login_challenge) {
    qs.set("login_challenge", flow.oauth2_login_challenge)
  }
  if (flow.return_to) {
    qs.set("return_to", flow.return_to)
  } else if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("return_to")) {
      qs.set("return_to", searchParams.get("return_to") || "")
    }
  }

  if (qs.toString().length === 0) {
    return result
  }

  return result + "?" + qs.toString()
}

function appendReturnTo(url: string, returnTo?: string) {
  if (!returnTo) {
    return url
  }

  const urlObj = new URL(url)
  urlObj.searchParams.set("return_to", returnTo)
  return urlObj.toString()
}

function appendAal(url: string, aal: AuthenticatorAssuranceLevel) {
  const urlObj = new URL(url)
  urlObj.searchParams.set("aal", aal)
  return urlObj.toString()
}

function appendRefresh(url: string, refresh: boolean) {
  const urlObj = new URL(url)
  urlObj.searchParams.set("refresh", refresh ? "true" : "false")
  return urlObj.toString()
}
