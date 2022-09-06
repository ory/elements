import React from "react"
import { UiNode, UiText } from "@ory/client"
import { gridStyle } from "../../../theme"
import { Message } from "../../message"

export type NodeMessagesProps = {
  nodes: UiNode[]
  uiMessages?: Array<UiText>
}

const nodeMessage = ({
  text,
  id,
  key,
}: {
  text: string
  id: number
  key: number
}) => (
  <Message key={key} data-testid={`ui/message/${id}`} severity={"error"}>
    {text}
  </Message>
)
export const NodeMessages = ({
  nodes,
  uiMessages,
}: NodeMessagesProps): JSX.Element => {
  const $groupMessages = nodes.map(({ messages }) =>
    messages.map(({ text, id }, key) => nodeMessage({ text, id, key })),
  )

  const $messages = uiMessages?.map(({ text, id }, key) =>
    nodeMessage({ text, id, key }),
  )

  return (
    <div className={gridStyle({ gap: 16 })}>
      {$messages && $messages}
      {$groupMessages}
    </div>
  )
}
