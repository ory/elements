// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { Divider, DividerProps } from "../react-components"
import { Container } from "./storyhelper"

export default {
  title: "Component/Divider",
  component: Divider,
} as Meta<typeof Divider>

const Template: StoryFn<DividerProps> = (args: DividerProps) => (
  <Container>
    <Divider {...args} />
  </Container>
)

export const DefaultDivider = Template.bind({})

export const FullWidthDivider = Template.bind({})

FullWidthDivider.args = {
  fullWidth: true,
}
