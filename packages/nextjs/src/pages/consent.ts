// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OAuth2ConsentRequest } from "@ory/client-fetch"
import { ParsedUrlQuery } from "querystring"

import { serverSideOAuth2Client } from "../app/client"

/**
 * Use this method in `getServerSideProps` of a pages router page to fetch an
 * OAuth2 consent request. Fetching the consent request requires the Ory
 * project API key, so it must never run in the browser.
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
 * import { getServerSideConsentFlow, useSession } from "@ory/nextjs/pages"
 * import { OAuth2ConsentRequest } from "@ory/client-fetch"
 * import { GetServerSideProps } from "next"
 *
 * import config from "@/ory.config"
 *
 * export const getServerSideProps: GetServerSideProps = async (context) => {
 *   const consentRequest = await getServerSideConsentFlow(context.query)
 *   if (!consentRequest) {
 *     return { notFound: true }
 *   }
 *   // Strip undefined values: Next.js requires JSON-serializable props.
 *   return {
 *     props: { consentRequest: JSON.parse(JSON.stringify(consentRequest)) },
 *   }
 * }
 *
 * export default function ConsentPage({
 *   consentRequest,
 * }: {
 *   consentRequest: OAuth2ConsentRequest
 * }) {
 *   const { session, loading } = useSession()
 *
 *   if (loading || !session) {
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
 * @param query - The parsed query of the incoming request.
 * @returns The OAuth2 consent request or null if no consent_challenge is found.
 * @public
 */
export async function getServerSideConsentFlow(
  query: ParsedUrlQuery,
): Promise<OAuth2ConsentRequest | null> {
  const consentChallenge = query["consent_challenge"]

  if (!consentChallenge || typeof consentChallenge !== "string") {
    return null
  }

  return serverSideOAuth2Client()
    .getOAuth2ConsentRequest({ consentChallenge })
    .catch(() => null)
}
