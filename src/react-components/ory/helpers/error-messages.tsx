import React from "react"
import { UiNode, UiText } from "@ory/client"
import { gridStyle } from "../../../theme"
import { Message } from "../../message"

export type NodeMessagesProps = {
  nodes?: UiNode[]
  uiMessages?: Array<UiText>
}

const nodeMessage = ({
  text,
  id,
  key,
}: {
  text: string
  id: number
  key: string
}) => (
  <Message key={key} data-testid={`ui/message/${id}`} severity={"error"}>
    {text}
  </Message>
)

export const NodeMessages = ({
  nodes,
  uiMessages,
}: NodeMessagesProps): JSX.Element | null => {
  const $groupMessages = nodes?.reduce<JSX.Element[]>(
    (groups, { messages }) => {
      groups = groups.concat(
        messages.map(({ text, id }, key) =>
          nodeMessage({ text, id, key: `node-group-message-${id}-${key}` }),
        ),
      )
      return groups
    },
    [],
  )

  const $messages = uiMessages?.map(({ text, id }, key) =>
    nodeMessage({ text, id, key: `ui-messsage-${id}-${key}` }),
  )

  const $allMessages = [...($groupMessages || []), ...($messages || [])]

  return $allMessages.length > 0 ? (
    <div className={gridStyle({ gap: 16 })}>{$allMessages}</div>
  ) : null
}
