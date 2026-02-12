// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, FrontendApi, OAuth2Api } from "@ory/client-fetch"
import type { NextApiRequest, NextApiResponse } from "next"

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_ORY_SDK_URL || process.env.ORY_SDK_URL
  if (!baseUrl) {
    throw new Error("ORY_SDK_URL is not set")
  }
  return baseUrl.replace(/\/$/, "")
}

function getOAuth2Client() {
  const apiKey = process.env.ORY_PROJECT_API_TOKEN ?? ""

  return new OAuth2Api(
    new Configuration({
      basePath: getBaseUrl(),
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    }),
  )
}

function getFrontendClient() {
  return new FrontendApi(
    new Configuration({
      basePath: getBaseUrl(),
      headers: {
        Accept: "application/json",
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
  const frontendClient = getFrontendClient()

  try {
    // Security: Fetch the consent request to get the expected subject
    const consentRequest = await oauth2Client.getOAuth2ConsentRequest({
      consentChallenge: consent_challenge,
    })

    // Security: Verify the current session matches the consent challenge subject
    // This prevents an attacker from using a stolen consent_challenge
    // to grant consent on behalf of a different user
    const cookie = req.headers.cookie
    if (!cookie) {
      console.error("Consent security: No session cookie provided")
      return res.status(401).json({ error: "Unauthorized: No session" })
    }

    let session
    try {
      session = await frontendClient.toSession({ cookie })
    } catch {
      console.error("Consent security: Invalid or expired session")
      return res.status(401).json({ error: "Unauthorized: Invalid session" })
    }

    // Compare the session identity with the consent request subject
    const sessionIdentityId = session.identity?.id
    const consentSubject = consentRequest.subject

    if (!sessionIdentityId || sessionIdentityId !== consentSubject) {
      console.error(
        "Consent security: Session identity mismatch. " +
          `Session: ${sessionIdentityId}, Consent subject: ${consentSubject}`,
      )
      return res.status(403).json({
        error: "Forbidden: Session does not match consent request subject",
      })
    }

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
