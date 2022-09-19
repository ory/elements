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
}: NodeMessagesProps): JSX.Element | null => {
  const $groupMessages = nodes.reduce<JSX.Element[]>((groups, { messages }) => {
    groups.concat(
      messages.map(({ text, id }) => nodeMessage({ text, id, key: id })),
    )
    return groups
  }, [])

  const $messages = uiMessages?.map(({ text, id }, key) =>
    nodeMessage({ text, id, key }),
  )

  return ($messages && $messages.length > 0) || $groupMessages.length > 0 ? (
    <div className={gridStyle({ gap: 16 })}>
      {$messages}
      {$groupMessages}
    </div>
  ) : null
}
