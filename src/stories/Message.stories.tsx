import { ComponentMeta, Story } from "@storybook/react"
import { Message, MessageProps } from "../react-components"
import { colorSprinkle } from "../theme"
import { Container } from "./storyhelper"

export default {
  title: "Component/Message",
  component: Message,
} as ComponentMeta<typeof Message>

export type MessageStoryProps = MessageProps

const Template: Story<MessageProps> = (args: MessageProps) => (
  <Container>
    <Message {...args}>I am a Message</Message>
    <Message {...args} className={colorSprinkle({ color: "foregroundMuted" })}>
      I am a different color
    </Message>
  </Container>
)

export const DefaultMessage = Template.bind({})

export const ErrorMessage = Template.bind({})

ErrorMessage.args = {
  severity: "error",
}
