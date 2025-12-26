// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Consent } from "@ory/elements-react/theme"
import { getConsentFlow, getServerSession, OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function ConsentPage(props: OryPageParams) {
  const consentRequest = await getConsentFlow(props.searchParams)
  const session = await getServerSession()

  if (!consentRequest || !session) {
    return null
  }

  return (
    <Consent
      consentChallenge={consentRequest}
      session={session}
      config={config}
      csrfToken=""
      formActionUrl="/api/consent"
      components={{
        Card: {},
      }}
    />
  )
}