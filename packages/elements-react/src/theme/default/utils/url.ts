// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function restartFlowUrl(
  flow: { request_url?: string; return_to?: string },
  fallback: string,
) {
  return flow.request_url || appendReturnTo(fallback, flow.return_to)
}

export function initFlowUrl(
  sdkUrl: string,
  flowType: string,
  flow: {
    return_to?: string
  },
) {
  const result = `${sdkUrl}/self-service/${flowType}/browser`
  const qs = new URLSearchParams()

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
