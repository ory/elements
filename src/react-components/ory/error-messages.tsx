import React from "react"
import { UiNode } from "@ory/client"
import { Message } from "../message"

export type ErrorMessagesProps = {
  nodes: UiNode[]
}

export const ErrorMessages = ({
  nodes,
}: ErrorMessagesProps): JSX.Element | null => {
  const errorMessage = nodes
    .map(({ messages }) => messages.reduce((p, c) => p + c.text, ""))
    .join(" ")
  return errorMessage ? (
    <Message severity={"error"}>{errorMessage}</Message>
  ) : null
}
