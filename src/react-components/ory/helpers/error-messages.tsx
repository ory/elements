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
} & MessageStyleProps

const nodeMessage = ({ text, id, key, ...props }: nodeMessageProps) => (
  <Message
    key={key}
    data-testid={`ui/message/${id}`}
    severity={"error"}
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
          .map(({ text, id }, key) => {
            return nodeMessage({
              text,
              id,
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

  const $messages = uiMessages?.map(({ text, id }, key) =>
    nodeMessage({ text, id, key: `ui-messsage-${id}-${key}` }),
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
