// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { Message, MessageProps } from "../react-components"
import { colorSprinkle } from "../theme"
import { Container } from "./storyhelper"

export default {
  title: "Component/Message",
  component: Message,
} as Meta<typeof Message>

export type MessageStoryProps = MessageProps

const Template: StoryFn<MessageProps> = (args: MessageProps) => (
  <Container>
    <Message {...args}>I am a Message</Message>
    <Message {...args} className={colorSprinkle({ color: "foregroundMuted" })}>
      I am a different color message
    </Message>
  </Container>
)

export const DefaultMessage = Template.bind({})

export const ErrorMessage = Template.bind({})

ErrorMessage.args = {
  severity: "error",
}
