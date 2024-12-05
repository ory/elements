// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { CardGradient, CardGradientProps } from "../react-components"
import { Container } from "./storyhelper"

export default {
  title: "Component/CardGradient",
  component: CardGradient,
} as Meta<typeof CardGradient>

const Template: StoryFn<CardGradientProps> = (args: CardGradientProps) => (
  <Container>
    <CardGradient {...args} />
  </Container>
)

export const Default = Template.bind({})

Default.args = {
  heading: "Heading",
  content: "Content",
  action: "Action",
}

export const Disabled = Template.bind({})

Disabled.args = {
  heading: "Disabled",
  content: "Content",
  action: "Action",
  disabled: true,
}
