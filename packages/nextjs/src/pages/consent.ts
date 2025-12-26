// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OAuth2ConsentRequest } from "@ory/client-fetch"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import { clientSideOAuth2Client } from "./client"

/**
 * A client-side hook to fetch an OAuth2 consent request.
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
 * import { useConsentFlow, useSession } from "@ory/nextjs/pages"
 *
 * import config from "@/ory.config"
 *
 * export default function ConsentPage() {
 *   const consentRequest = useConsentFlow()
 *   const { session, loading } = useSession()
 *
 *   if (!consentRequest || loading || !session) {
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
 * @returns The OAuth2 consent request or null/undefined.
 * @public
 * @function
 * @group Hooks
 */
export function useConsentFlow(): OAuth2ConsentRequest | null | undefined {
  const [consentRequest, setConsentRequest] = useState<OAuth2ConsentRequest>()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!router.isReady || consentRequest !== undefined) {
      return
    }

    const consentChallenge = searchParams.get("consent_challenge")

    if (!consentChallenge) {
      return
    }

    clientSideOAuth2Client()
      .getOAuth2ConsentRequest({ consentChallenge })
      .then(setConsentRequest)
      .catch(() => {
        // Silent failure - no consent request available
      })
  }, [searchParams, router, router.isReady, consentRequest])

  return consentRequest
}