// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { messageTestId, useComponents, useOryFlow } from "@ory/elements-react"
import { useCardHeaderText } from "../../utils/constructCardHeader"
import { DefaultCurrentIdentifierButton } from "./current-identifier-button"

function InnerCardHeader({
  title,
  text,
  messageId,
}: {
  title: string
  text?: string
  messageId?: string
}) {
  const { Card } = useComponents()
  return (
    <header className="flex flex-col gap-8 antialiased">
      <Card.Logo />
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

  return (
    <InnerCardHeader title={title} text={description} messageId={messageId} />
  )
}
