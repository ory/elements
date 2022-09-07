import React from "react"
import { Story, ComponentMeta } from "@storybook/react"
import { InputField, InputFieldProps } from "../react-components"
import { Container } from "./storyhelper"

export default {
  title: "Component/InputField",
  component: InputField,
  argTypes: {
    theme: {
      options: ["light", "dark"],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof InputField>

const Template: Story<InputFieldProps> = (args: InputFieldProps) => (
  <Container>
    <InputField {...args} />
  </Container>
)

export const NormalInputField = Template.bind({})

NormalInputField.args = {
  header: "Password",
  required: true,
}
