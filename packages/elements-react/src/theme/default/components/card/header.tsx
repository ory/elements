// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow, RegistrationFlow } from "@ory/client-fetch"
import { messageTestId, useComponents, useOryFlow } from "@ory/elements-react"
import { useCardHeaderText } from "../../utils/constructCardHeader"
import { DefaultCurrentIdentifierButton } from "./current-identifier-button"

/**
 * Extracts OAuth2 client info from login or registration flows.
 */
function getOAuth2ClientInfo(flow: unknown, flowType: FlowType) {
  if (flowType === FlowType.Login || flowType === FlowType.Registration) {
    const typedFlow = flow as LoginFlow | RegistrationFlow
    const client = typedFlow.oauth2_login_request?.client
    if (client) {
      return {
        clientName: client.client_name,
        logoUri: client.logo_uri,
      }
    }
  }
  return null
}

function InnerCardHeader({
  title,
  text,
  messageId,
  oauth2Client,
}: {
  title: string
  text?: string
  messageId?: string
  oauth2Client?: { clientName?: string; logoUri?: string } | null
}) {
  const { Card } = useComponents()
  return (
    <header className="flex flex-col gap-8 antialiased">
      {oauth2Client?.logoUri ? (
        <div className="flex items-center gap-4">
          <img
            src={oauth2Client.logoUri}
            alt={oauth2Client.clientName ?? "OAuth2 Client"}
            className="h-12 w-12 rounded-lg object-contain"
          />
          <Card.Logo />
        </div>
      ) : (
        <Card.Logo />
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg leading-normal font-semibold text-interface-foreground-default-primary">
          {title}
        </h2>
        <p
          className="leading-normal text-interface-foreground-default-secondary"
          {...(messageId ? messageTestId({ id: messageId }) : {})}
        >
          {text}
        </p>
        <DefaultCurrentIdentifierButton />
      </div>
    </header>
  )
}

/**
 * Renders the default card header component.
 *
 * This component is used to display the header of a card, including the logo, title, description, and current identifier button.
 *
 * @returns the default card header component
 * @group Components
 * @category Default Components
 */
export function DefaultCardHeader() {
  const context = useOryFlow()
  const { title, description, messageId } = useCardHeaderText(
    context.flow.ui,
    context,
  )
  const oauth2Client = getOAuth2ClientInfo(context.flow, context.flowType)

  return (
    <InnerCardHeader
      title={title}
      text={description}
      messageId={messageId}
      oauth2Client={oauth2Client}
    />
  )
}
