// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, OAuth2Api } from "@ory/client-fetch"
import type { NextApiRequest, NextApiResponse } from "next"

function getOAuth2Client() {
  const baseUrl = process.env.NEXT_PUBLIC_ORY_SDK_URL || process.env.ORY_SDK_URL
  if (!baseUrl) {
    throw new Error("ORY_SDK_URL is not set")
  }

  const apiKey = process.env.ORY_PROJECT_API_TOKEN ?? ""

  return new OAuth2Api(
    new Configuration({
      basePath: baseUrl.replace(/\/$/, ""),
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    }),
  )
}

interface ConsentRequestBody {
  action?: string
  consent_challenge?: string
  grant_scope?: string | string[]
  remember?: string | boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = req.body as ConsentRequestBody
  const { action, consent_challenge, grant_scope, remember } = body

  if (!consent_challenge) {
    return res.status(400).json({ error: "Missing consent_challenge" })
  }

  const oauth2Client = getOAuth2Client()

  try {
    let redirectTo: string

    if (action === "accept") {
      const scopes: string[] = Array.isArray(grant_scope)
        ? grant_scope
        : grant_scope
          ? [grant_scope]
          : []

      const response = await oauth2Client.acceptOAuth2ConsentRequest({
        consentChallenge: consent_challenge,
        acceptOAuth2ConsentRequest: {
          grant_scope: scopes,
          remember: remember === "true" || remember === true,
        },
      })
      redirectTo = response.redirect_to
    } else {
      const response = await oauth2Client.rejectOAuth2ConsentRequest({
        consentChallenge: consent_challenge,
        rejectOAuth2Request: {
          error: "access_denied",
          error_description: "The resource owner denied the request",
        },
      })
      redirectTo = response.redirect_to
    }

    return res.status(200).json({ redirect_to: redirectTo })
  } catch (error) {
    console.error("Consent error:", error)
    return res.status(500).json({ error: "Failed to process consent" })
  }
}
