import { FlowType } from "@ory/client-helpers"
import { OryCardFooterProps, useOryFlow } from "@ory/react-headless"
import {} from "@ory/react-headless"

import { useSearchParams } from "next/navigation"
import { useIntl } from "react-intl"

export function DefaultCardFooter({}: OryCardFooterProps) {
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

function LoginCardFooter() {
  const { config } = useOryFlow()
  const searchParams = useSearchParams()
  const intl = useIntl()

  if (!config.project.registrationEnabled) {
    return null
  }

  let registrationLink = `/self-service/registration/browser`
  const returnTo = searchParams?.get("return_to")
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
  const searchParams = useSearchParams()
  const intl = useIntl()
  let loginLink = `/self-service/login/browser`
  const returnTo = searchParams?.get("return_to")
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
