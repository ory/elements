// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function restartFlowUrl(
  flow: {
    id: string
    request_url?: string
    requested_aal?: string
    return_to?: string
    identity_schema?: string
  },
  fallback: string,
) {
  return (
    flow.request_url ||
    appendReturnToAndIdentitySchema(
      fallback,
      flow.return_to,
      flow.identity_schema,
    )
  )
}

export function initFlowUrl(
  sdkUrl: string,
  flowType: string,
  flow: {
    id: string
    return_to?: string
    oauth2_login_challenge?: string
    identity_schema?: string
  },
) {
  const result = `${sdkUrl}/self-service/${flowType}/browser`
  const qs = new URLSearchParams()

  if (flow.oauth2_login_challenge) {
    qs.set("login_challenge", flow.oauth2_login_challenge)
  }
  if (flow.identity_schema) {
    qs.set("identity_schema", flow.identity_schema)
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

function appendReturnToAndIdentitySchema(
  url: string,
  returnTo?: string,
  identitySchema?: string,
) {
  const urlObj = new URL(url)
  if (returnTo) {
    urlObj.searchParams.set("return_to", returnTo)
  }
  if (identitySchema) {
    urlObj.searchParams.set("identity_schema", identitySchema)
  }
  return urlObj.toString()
}
