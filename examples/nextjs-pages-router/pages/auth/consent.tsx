// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OAuth2ConsentRequest } from "@ory/client-fetch"
import { Consent } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getServerSideConsentFlow, useSession } from "@ory/nextjs/pages"
import { GetServerSideProps } from "next"

import config from "@/ory.config"

interface ConsentPageProps {
  consentRequest: OAuth2ConsentRequest
}

// The @csrf-armor/nextjs/client barrel pulls in next/navigation, which breaks
// the pages router build, so the cookie is read with a local helper instead.
function getCsrfTokenFromCookie(): string {
  if (typeof document === "undefined") {
    return ""
  }
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("csrf-token="))
  return cookie ? decodeURIComponent(cookie.slice("csrf-token=".length)) : ""
}

export const getServerSideProps: GetServerSideProps<ConsentPageProps> = async (
  context,
) => {
  const consentRequest = await getServerSideConsentFlow(context.query)

  if (!consentRequest) {
    return { notFound: true }
  }

  // Strip undefined values: Next.js requires JSON-serializable props.
  return {
    props: {
      consentRequest: JSON.parse(
        JSON.stringify(consentRequest),
      ) as OAuth2ConsentRequest,
    },
  }
}

export default function ConsentPage({ consentRequest }: ConsentPageProps) {
  const { session, loading } = useSession()
  const csrfToken = getCsrfTokenFromCookie()

  if (loading || !session) {
    return null
  }

  if (session.identity?.id !== consentRequest.subject) {
    return (
      <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
        <p>This consent request was issued for a different account.</p>
      </main>
    )
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
