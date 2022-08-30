import React from "react"
import { Story, ComponentMeta } from "@storybook/react"
import { Checkbox, CheckboxProps } from "../react-components"
import { Container } from "./storyhelper"

export default {
  title: "Component/Checkbox",
  component: Checkbox,
  argTypes: {
    theme: {
      options: ["light", "dark"],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof Checkbox>

const Template: Story<CheckboxProps> = (args: CheckboxProps) => (
  <Container>
    <Checkbox {...args} />
  </Container>
)

export const NormalCheckbox = Template.bind({})

NormalCheckbox.args = {}
