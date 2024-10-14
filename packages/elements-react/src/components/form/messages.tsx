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

export function OryCardValidationMessages({ ...props }: OryMessageRootProps) {
  const { flow } = useOryFlow()
  const messages = flow.ui.messages
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
