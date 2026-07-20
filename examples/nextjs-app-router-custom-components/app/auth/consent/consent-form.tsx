// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"

import { getCsrfToken } from "@csrf-armor/nextjs/client"
import { OAuth2ConsentRequest, Session } from "@ory/client-fetch"
import { Consent } from "@ory/elements-react/theme"
import { useEffect, useState } from "react"

import { myCustomComponents } from "@/components"
import config from "@/ory.config"

interface ConsentFormProps {
  consentRequest: OAuth2ConsentRequest
  session: Session
}

export function ConsentForm({ consentRequest, session }: ConsentFormProps) {
  // The csrf-token cookie is set by the CSRF middleware on the first response,
  // so it is only readable client-side, after hydration.
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    setCsrfToken(getCsrfToken() ?? "")
  }, [])

  return (
    <Consent
      consentChallenge={consentRequest}
      session={session}
      config={config}
      csrfToken={csrfToken}
      formActionUrl="/api/consent"
      components={myCustomComponents}
    />
  )
}
