import { UiNode, UiText } from "@ory/client"
import { GridStyle, gridStyle } from "../../../theme"
import { Message, MessageStyleProps } from "../../message"

export type NodeMessagesProps = {
  nodes?: UiNode[]
  uiMessages?: Array<UiText>
} & GridStyle &
  MessageStyleProps

type nodeMessageProps = {
  text: string
  id: number
  key: string
  type: string
} & MessageStyleProps

const nodeMessage = ({ text, id, type, key, ...props }: nodeMessageProps) => (
  <Message
    key={key}
    data-testid={`ui/message/${id}`}
    severity={type === "info" ? "success" : "error"}
    {...props}
  >
    {text}
  </Message>
)

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
          .map(({ text, id, type }, key) => {
            return nodeMessage({
              text,
              id,
              type,
              key: `node-group-message-${id}-${key}`,
              ...messageProps,
            })
          })
          .filter(Boolean),
      )
      return groups
    },
    [],
  )

  const $messages = uiMessages?.map(({ text, id, type }, key) =>
    nodeMessage({ text, id, type, key: `ui-messsage-${id}-${key}` }),
  )

  const $allMessages = [...($groupMessages || []), ...($messages || [])]

  return $allMessages.length > 0 ? (
    <div
      className={gridStyle({
        gap: gap || 16,
        direction: direction,
      })}
    >
      {$allMessages}
    </div>
  ) : null
}
