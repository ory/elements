import { FlowType, OAuth2ConsentRequest, Session } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryConsentCard,
  OryFlowComponentOverrides,
  OryProvider,
} from "@ory/elements-react"
import { ComponentProps, PropsWithChildren } from "react"
import { getOryComponents } from "../components"
import { translateConsentChallengeToUiNodes } from "../utils/oauth2"

type PropsWithComponents = {
  components?: OryFlowComponentOverrides
}

export type ConsentFormData = {
  scopes: string[]
}

export type ConsentFlowContextProps = {
  consentChallenge: OAuth2ConsentRequest
  session: Session
  config: OryClientConfiguration
  csrfToken: string
  formAction: string
} & PropsWithComponents &
  ComponentProps<"form"> & {
    submitting: boolean
  }

export function Consent({
  consentChallenge,
  session,
  config,
  components: Passed,
  children,
  csrfToken,
  formAction,
}: PropsWithChildren<ConsentFlowContextProps>) {
  const components = getOryComponents(Passed)

  const flow = translateConsentChallengeToUiNodes(
    consentChallenge,
    csrfToken,
    formAction,
    session,
  )

  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.OAuth2Consent}
      components={components}
    >
      {children ?? <OryConsentCard />}
    </OryProvider>
  )
}
