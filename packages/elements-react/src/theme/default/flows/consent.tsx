// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, OAuth2ConsentRequest, Session } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryConsentCard,
  OryFlowComponentOverrides,
  OryProvider,
} from "@ory/elements-react"
import { getOryComponents } from "../components"
import { translateConsentChallengeToUiNodes } from "../utils/oauth2"

/**
 * All the props that are passed to the Consent component.
 *
 * @hidden
 * @inline
 */
export type ConsentFlowProps = {
  /**
   * The OAuth2 consent request object.
   */
  consentChallenge: OAuth2ConsentRequest
  /**
   * The session object.
   *
   * Since the consent flow is used in the context of a logged-in user, the session object is required.
   * It contains information about the user, such as their ID and any associated metadata.
   * This information is used to accept or reject the consent request based on the user's preferences.
   * The session object is typically obtained from the Ory Kratos session API.
   */
  session: Session
  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL
   */
  config: OryClientConfiguration
  /**
   * The CSRF token to protect against CSRF attacks.
   *
   * This token is used to prevent cross-site request forgery attacks by ensuring that the request
   * is coming from the same origin as the consent flow.
   */
  csrfToken: string
  /**
   * The URL to submit the consent form to.
   *
   * This URL is typically an endpoint on the server that handles the consent request.
   *
   * Make sure that this endpoint handles CSRF protection. During the form submission
   * the Consent component will send along the CSRF token passed in the props.
   * The server should validate this token before processing the consent request.
   */
  formActionUrl: string
  /**
   * The components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the consent flow.
   */
  components?: OryFlowComponentOverrides

  /**
   * Optional children to render inside the Consent component.
   *
   * If not provided, the default OryConsentCard will be rendered.
   */
  children?: React.ReactNode
}
/**
 * The Consent component allows you to render the consent flow for Ory OAuth2.
 *
 * It is used to request user consent for accessing their data and resources.
 * The component takes in the OAuth2 consent request object, the session object,
 * the Ory client configuration, a CSRF token, and the URL to submit the consent form to.
 *
 * @param props - The props for the Consent component.
 * @returns the Consent component.
 * @group Components
 * @category Flows
 */
export function Consent({
  consentChallenge,
  session,
  config,
  components: Passed,
  children,
  csrfToken,
  formActionUrl,
}: ConsentFlowProps) {
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
