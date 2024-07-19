import { useComponents } from "../../context/component"
import { useOryFlow } from "../../context/flow-context"
import { UiText } from "@ory/client-fetch"
import { DetailedHTMLProps, HTMLAttributes } from "react"

export type HeadlessMessagesProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export function OryCardValidationMessages({ ...props }: HeadlessMessagesProps) {
  const { flow } = useOryFlow()
  const messages = flow.ui.messages
  const { MessageContainer } = useComponents()

  if (!messages) {
    return null
  }

  return (
    <MessageContainer {...props}>
      {messages?.map((message) => (
        <HeadlessMessage key={message.id} message={message} />
      ))}
    </MessageContainer>
  )
}

export type HeadlessMessageProps = {
  message: UiText
}

export function HeadlessMessage({ message }: HeadlessMessageProps) {
  const { Message } = useComponents()
  return <Message message={message} />
}
