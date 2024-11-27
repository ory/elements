// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryFlow, useComponents } from "../../context"
import { UiText } from "@ory/client-fetch"
import { DetailedHTMLProps, HTMLAttributes } from "react"

export type OryMessageContentProps = {
  message: UiText
}

export type OryMessageRootProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

// This is a list of message IDs that should not be shown to the user.
// They're returned by the API, but they don't work well in the two step flows.
const messageIdsToHide = [1040009, 1060003, 1080003, 1010014, 1040005, 1010016]

export function OryCardValidationMessages({ ...props }: OryMessageRootProps) {
  const { flow } = useOryFlow()
  const messages = flow.ui.messages?.filter(
    (m) => !messageIdsToHide.includes(m.id),
  )
  const { Message } = useComponents()

  if (!messages) {
    return null
  }

  return (
    <Message.Root {...props}>
      {messages?.map((message) => (
        <Message.Content key={message.id} message={message} />
      ))}
    </Message.Root>
  )
}
