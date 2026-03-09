// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Consent } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { useConsentFlow, useSession } from "@ory/nextjs/pages"

import config from "@/ory.config"

function getCsrfTokenFromCookie(): string {
  if (typeof document === "undefined") return ""
  const match = document.cookie.match(/(^|;\s*)csrf-token=([^;]*)/)
  return match?.[2] ?? ""
}

export default function ConsentPage() {
  const consentRequest = useConsentFlow()
  const { session, loading } = useSession()
  const csrfToken = getCsrfTokenFromCookie()

  if (!consentRequest || loading || !session) {
    return null
  }

  return (
    <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
      <Consent
        consentChallenge={consentRequest}
        session={session}
        config={config}
        csrfToken={csrfToken}
        formActionUrl="/api/consent"
        components={{
          Card: {},
        }}
      />
    </main>
  )
}
