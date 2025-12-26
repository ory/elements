// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OAuth2ConsentRequest } from "@ory/client-fetch"

import { QueryParams } from "../types"
import { serverSideOAuth2Client } from "./client"

/**
 * Use this method in an app router page to fetch an OAuth2 consent request.
 * This method works with server-side rendering.
 *
 * The consent flow is different from other Ory flows - it requires:
 * 1. A consent_challenge query parameter (provided by Ory Hydra)
 * 2. A valid user session (the user must be logged in)
 * 3. A CSRF token for form protection
 * 4. A form action URL where the consent form submits to
 *
 * @example
 * ```tsx
 * import { Consent } from "@ory/elements-react/theme"
 * import { getConsentFlow, getServerSession, OryPageParams } from "@ory/nextjs/app"
 *
 * import config from "@/ory.config"
 *
 * export default async function ConsentPage(props: OryPageParams) {
 *   const consentRequest = await getConsentFlow(props.searchParams)
 *   const session = await getServerSession()
 *
 *   if (!consentRequest || !session) {
 *     return null
 *   }
 *
 *   return (
 *     <Consent
 *       consentChallenge={consentRequest}
 *       session={session}
 *       config={config}
 *       csrfToken="your-csrf-token"
 *       formActionUrl="/api/consent"
 *     />
 *   )
 * }
 * ```
 *
 * @param params - The query parameters of the request.
 * @returns The OAuth2 consent request or null if no consent_challenge is found.
 * @public
 */
export async function getConsentFlow(
  params: QueryParams | Promise<QueryParams>,
): Promise<OAuth2ConsentRequest | null> {
  const resolvedParams = await params
  const consentChallenge = resolvedParams["consent_challenge"]

  if (!consentChallenge || typeof consentChallenge !== "string") {
    return null
  }

  return serverSideOAuth2Client()
    .getOAuth2ConsentRequest({ consentChallenge })
    .catch(() => null)
}

/**
 * Accept an OAuth2 consent request.
 *
 * This method should be called from an API route handler when the user accepts the consent.
 *
 * @example
 * ```tsx
 * // app/api/consent/route.ts
 * import { acceptConsentRequest, rejectConsentRequest } from "@ory/nextjs/app"
 * import { redirect } from "next/navigation"
 *
 * export async function POST(request: Request) {
 *   const formData = await request.formData()
 *   const action = formData.get("action")
 *   const consentChallenge = formData.get("consent_challenge") as string
 *   const grantScope = formData.getAll("grant_scope") as string[]
 *   const remember = formData.get("remember") === "true"
 *
 *   if (action === "accept") {
 *     const redirectTo = await acceptConsentRequest(consentChallenge, {
 *       grantScope,
 *       remember,
 *       session: { ... }
 *     })
 *     return redirect(redirectTo)
 *   } else {
 *     const redirectTo = await rejectConsentRequest(consentChallenge)
 *     return redirect(redirectTo)
 *   }
 * }
 * ```
 *
 * @param consentChallenge - The consent challenge from the form.
 * @param options - Options for accepting the consent request.
 * @returns The redirect URL to complete the OAuth2 flow.
 * @public
 */
export async function acceptConsentRequest(
  consentChallenge: string,
  options: {
    grantScope: string[]
    remember?: boolean
    rememberFor?: number
    session?: {
      accessToken?: Record<string, unknown>
      idToken?: Record<string, unknown>
    }
  },
): Promise<string> {
  const response = await serverSideOAuth2Client().acceptOAuth2ConsentRequest({
    consentChallenge,
    acceptOAuth2ConsentRequest: {
      grant_scope: options.grantScope,
      remember: options.remember,
      remember_for: options.rememberFor,
      session: options.session
        ? {
            access_token: options.session.accessToken,
            id_token: options.session.idToken,
          }
        : undefined,
    },
  })

  return response.redirect_to
}

/**
 * Reject an OAuth2 consent request.
 *
 * This method should be called from an API route handler when the user rejects the consent.
 *
 * @param consentChallenge - The consent challenge from the form.
 * @param options - Options for rejecting the consent request.
 * @returns The redirect URL to complete the OAuth2 flow.
 * @public
 */
export async function rejectConsentRequest(
  consentChallenge: string,
  options?: {
    error?: string
    errorDescription?: string
  },
): Promise<string> {
  const response = await serverSideOAuth2Client().rejectOAuth2ConsentRequest({
    consentChallenge,
    rejectOAuth2Request: {
      error: options?.error ?? "access_denied",
      error_description:
        options?.errorDescription ?? "The resource owner denied the request",
    },
  })

  return response.redirect_to
}