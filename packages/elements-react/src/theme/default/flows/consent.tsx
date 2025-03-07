import { FlowType, OAuth2ConsentRequest, Session } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import { ComponentProps, PropsWithChildren, useState } from "react"
import { oauth2Client } from "../../../client/frontendClient"
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
  submitting,
  children,
  csrfToken,
  formAction,
  ...formProps
}: PropsWithChildren<ConsentFlowContextProps>) {
  const components = getOryComponents(Passed)
  const [acceptedScopes, setAcceptedScopes] = useState(
    consentChallenge.requested_scope ?? [],
  )

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await oauth2Client().acceptOAuth2ConsentRequest({
      consentChallenge: consentChallenge.challenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: acceptedScopes,
      },
    })
    if (result.redirect_to) {
      window.location.href = result.redirect_to
    }
  }

  const handleScopeChange = (scope: string, accepted: boolean) => {
    if (accepted) {
      setAcceptedScopes([...acceptedScopes, scope])
    } else {
      setAcceptedScopes(acceptedScopes.filter((s) => s !== scope))
    }
  }
  const flow = translateConsentChallengeToUiNodes(
    consentChallenge,
    csrfToken,
    formAction,
  )

  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Consent}
      components={components}
    >
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
