// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { acceptConsentRequest, rejectConsentRequest } from "@ory/nextjs/app"
import { NextResponse } from "next/server"

interface ConsentBody {
  action?: string
  consent_challenge?: string
  grant_scope?: string | string[]
  remember?: boolean | string
}

async function parseRequest(request: Request): Promise<ConsentBody> {
  const contentType = request.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return (await request.json()) as ConsentBody
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData()
    return {
      action: formData.get("action") as string,
      consent_challenge: formData.get("consent_challenge") as string,
      grant_scope: formData.getAll("grant_scope") as string[],
      remember: formData.get("remember") as string,
    }
  }

  // Try JSON as fallback
  try {
    return (await request.json()) as ConsentBody
  } catch {
    return {}
  }
}

export async function POST(request: Request) {
  const body = await parseRequest(request)

  const action = body.action
  const consentChallenge = body.consent_challenge
  const grantScope = Array.isArray(body.grant_scope)
    ? body.grant_scope
    : body.grant_scope
      ? [body.grant_scope]
      : []
  const remember = body.remember === true || body.remember === "true"

  if (!consentChallenge) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing consent_challenge" },
      { status: 400 },
    )
  }

  try {
    let redirectTo: string

    if (action === "accept") {
      redirectTo = await acceptConsentRequest(consentChallenge, {
        grantScope,
        remember,
      })
    } else {
      redirectTo = await rejectConsentRequest(consentChallenge)
    }

    return NextResponse.json({ redirect_to: redirectTo })
  } catch (error) {
    console.error("Consent error:", error)
    return NextResponse.json(
      { error: "server_error", error_description: "Failed to process consent" },
      { status: 500 },
    )
  }
}