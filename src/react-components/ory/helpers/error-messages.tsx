// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiText } from "@ory/client"
import { JSX } from "react"
import { useIntl } from "react-intl"

import { GridStyle, gridStyle, Severity } from "../../../theme"
import { Message, MessageStyleProps } from "../../message"
import { uiTextToFormattedMessage } from "./node"

export type NodeMessagesProps = {
  nodes?: UiNode[]
  uiMessages?: UiText[]
} & GridStyle &
  MessageStyleProps

type nodeMessageProps = {
  message: UiText
  key: string
} & MessageStyleProps

const nodeMessage = ({ key, message, ...props }: nodeMessageProps) => {
  const intl = useIntl()
  return (
    <Message
      key={key}
      data-testid={`ui/message/${message.id}`}
      severity={message.type as Severity}
      {...props}
    >
      {uiTextToFormattedMessage(message, intl)}
    </Message>
  )
}

export const NodeMessages = ({
  nodes,
  uiMessages,
  ...props
}: NodeMessagesProps): JSX.Element | null => {
  const { gap, direction, ...messageProps } = props
  const $groupMessages = nodes?.reduce<JSX.Element[]>(
    (groups, { messages }) => {
      groups.push(
        ...messages
          .map((message, key) => {
            return nodeMessage({
              message,
              key: `node-group-message-${message.id}-${key}`,
              ...messageProps,
            })
          })
          .filter(Boolean),
      )
      return groups
    },
    [],
  )

  const $messages = uiMessages?.map((message, key) =>
    nodeMessage({ message, key: `ui-messsage-${message.id}-${key}` }),
  )

  const $allMessages = [...($groupMessages ?? []), ...($messages ?? [])]

  return $allMessages.length > 0 ? (
    <div
      className={gridStyle({
        gap: gap ?? 16,
        direction: direction,
      })}
    >
      {$allMessages}
    </div>
  ) : null
}
