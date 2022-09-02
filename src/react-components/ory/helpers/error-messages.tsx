import React from "react"
import { UiNode } from "@ory/client"
import { Message } from "../../message"

export type ErrorMessagesProps = {
  nodes: UiNode[]
}

export const ErrorMessages = ({ nodes }: ErrorMessagesProps): JSX.Element => {
  return (
    <>
      {nodes.map(({ messages }) =>
        messages.map(({ text, id }, key) => (
          <Message
            key={key}
            data-testid={`ui/message/${id}`}
            severity={"error"}
          >
            {text}
          </Message>
        )),
      )}
    </>
  )
}
