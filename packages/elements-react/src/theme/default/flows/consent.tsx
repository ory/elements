import { FlowType, OAuth2ConsentRequest, Session } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryConsentCard,
  OryFlowComponentOverrides,
  OryProvider,
} from "@ory/elements-react"
import { PropsWithChildren } from "react"
import { getOryComponents } from "../components"
import { translateConsentChallengeToUiNodes } from "../utils/oauth2"

type PropsWithComponents = {
  components?: OryFlowComponentOverrides
}

export type ConsentFlowContextProps = {
  consentChallenge: OAuth2ConsentRequest
  session: Session
  config: OryClientConfiguration
  csrfToken: string
  formActionUrl: string
} & PropsWithComponents

export function Consent({
  consentChallenge,
  session,
  config,
  components: Passed,
  children,
  csrfToken,
  formActionUrl,
}: PropsWithChildren<ConsentFlowContextProps>) {
  const components = getOryComponents(Passed)

  const flow = translateConsentChallengeToUiNodes(
    consentChallenge,
    csrfToken,
    formActionUrl,
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
