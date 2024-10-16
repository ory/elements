// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { useIntl } from "react-intl"
import { useOryFlow } from "@ory/elements-react"

export function DefaultCardFooter() {
  const { flowType } = useOryFlow()
  switch (flowType) {
    case FlowType.Login:
      return <LoginCardFooter />
    case FlowType.Registration:
      return <RegistrationCardFooter />
    case FlowType.Recovery:
      return <RecoveryCardFooter />
    case FlowType.Verification:
      return <VerificationCardFooter />
    default:
      return null
  }
}

function getReturnToQueryParam() {
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get("return_to")
  }
}

function LoginCardFooter() {
  const { config } = useOryFlow()
  const intl = useIntl()

  if (!config.project.registration_enabled) {
    return null
  }

  let registrationLink = `${config.sdk.url}/self-service/registration/browser`
  const returnTo = getReturnToQueryParam()
  if (returnTo) {
    registrationLink += `?return_to=${returnTo}`
  }

  return (
    <span className="text-sm font-normal antialiased leading-normal">
      {intl.formatMessage({
        id: "login.registration-label",
        defaultMessage: "No account?",
      })}{" "}
      <a
        className="text-links-link-default hover:underline hover:text-link-hover transition-colors"
        href={registrationLink}
      >
        {intl.formatMessage({
          id: "login.registration-button",
          defaultMessage: "Sign up",
        })}
      </a>
    </span>
  )
}

function RegistrationCardFooter() {
  const intl = useIntl()
  const { config } = useOryFlow()
  let loginLink = `${config.sdk.url}/self-service/login/browser`
  const returnTo = getReturnToQueryParam()
  if (returnTo) {
    loginLink += `?return_to=${returnTo}`
  }
  return (
    <span className="text-sm font-normal antialiased leading-normal">
      {intl.formatMessage({
        id: "registration.login-label",
        defaultMessage: "Already have an account?",
      })}{" "}
      <a
        className="text-links-link-default hover:underline hover:text-link-hover transition-colors"
        href={loginLink}
      >
        {intl.formatMessage({
          id: "registration.login-button",
          defaultMessage: "Sign in",
        })}
      </a>
    </span>
  )
}

function RecoveryCardFooter() {
  return null
}

function VerificationCardFooter() {
  return null
}
