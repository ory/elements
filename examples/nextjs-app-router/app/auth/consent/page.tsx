// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  getConsentFlow,
  getServerSession,
  OryPageParams,
} from "@ory/nextjs/app"

import { ConsentForm } from "./consent-form"

export default async function ConsentPage(props: OryPageParams) {
  const consentRequest = await getConsentFlow(props.searchParams)
  const session = await getServerSession()

  if (!consentRequest || !session) {
    return null
  }

  if (session.identity?.id !== consentRequest.subject) {
    return <p>This consent request was issued for a different account.</p>
  }

  return <ConsentForm consentRequest={consentRequest} session={session} />
}
