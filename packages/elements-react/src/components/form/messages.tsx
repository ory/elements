// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { useComponents, useOryFlow } from "../../context"
import { PropsWithChildren } from "react"

/**
 * Props for the OryMessageContent component.
 *
 * @interface
 */
export type OryMessageContentProps = {
  /**
   * The message to display.
   */
  message: UiText
}

/**
 *
 * @interface
 * @expand
 */
export type OryMessageRootProps = PropsWithChildren

/**
 * Props for the {@link OryCardValidationMessages} component.
 *
 * @inline
 * @hidden
 */
export interface OryCardValidationMessagesProps {
  /**
   * An array of message IDs that should be hidden.
   * This is useful for hiding specific messages that are not relevant to the user or are rendered elsewhere.
   * If not provided, the default list of message IDs to hide will be used.
   * @default [1040009, 1060003, 1080003, 1010004, 1010014, 1040005, 1010016, 1010003]
   *
   * @see https://www.ory.sh/docs/kratos/concepts/ui-messages
   */
  hiddenMessageIds?: number[]
}

/**
 * Renders the {@link OryFlowComponents.Message.Content} component for each message in the current flow.
 *
 * See also {@link useOryFlow}
 * @returns
 * @group Components
 */
export function OryCardValidationMessages({
  hiddenMessageIds = [
    1040009, 1060003, 1080003, 1010004, 1010014, 1040005, 1010016, 1010003,
  ],
}: OryCardValidationMessagesProps) {
  const { flow } = useOryFlow()
  const messages = flow.ui.messages?.filter(
    (m) => !hiddenMessageIds.includes(m.id),
  )
  const { Message } = useComponents()

  if (!messages) {
    return null
  }

  return (
    <Message.Root>
      {messages?.map((message) => (
        <Message.Content key={message.id} message={message} />
      ))}
    </Message.Root>
  )
}
