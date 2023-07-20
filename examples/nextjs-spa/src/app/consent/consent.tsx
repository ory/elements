"use client"

import { OAuth2ConsentRequest } from "@ory/client"
import {
  ConsentFormPayload,
  CustomOnSubmitCallback,
  UserConsentCard,
} from "@ory/elements"

type ConsentProps = {
  consent: OAuth2ConsentRequest
  csrf_token: string
}

const Consent = ({ consent, csrf_token }: ConsentProps) => {
  const onSubmit: CustomOnSubmitCallback<ConsentFormPayload> = ({ body }) => {
    fetch(`/api/consent`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log({ response })
        if (response.redirected) {
          window.location.href = response.url
          return
        }
      })
      .catch((err) => console.error(err))
  }
  return (
    <UserConsentCard
      cardImage="/ory.svg"
      consent={consent}
      csrfToken={csrf_token}
      action={"/consent"}
      client_name={consent.client?.client_name || "unknown client"}
      requested_scope={consent.requested_scope}
      onSubmit={onSubmit}
    />
  )
}

export default Consent
