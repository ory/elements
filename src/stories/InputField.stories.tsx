// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { InputField, InputFieldProps, Message } from "../react-components"
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
} as Meta<typeof InputField>

const Template: StoryFn<InputFieldProps> = (args: InputFieldProps) => (
  <Container>
    <InputField {...args} />
  </Container>
)

export const NormalInputField = Template.bind({})

NormalInputField.args = {
  header: "Name",
  required: true,
  type: "text",
}

export const InputWithHelperText = Template.bind({})

InputWithHelperText.args = {
  header: "Password",
  helperMessage: "Password must be at least 8 characters long",
  required: true,
}

export const InputWithMessageComponentHelperText = Template.bind({})

InputWithMessageComponentHelperText.args = {
  header: "Password",
  helperMessage: (
    <Message severity="error" textPosition="start">
      Password must be at least 8 characters long
    </Message>
  ),
  required: true,
}

export const PasswordInputField = Template.bind({})

PasswordInputField.args = {
  header: "Password",
  helperMessage: "Password must be at least 8 characters long",
  placeholder: "Enter password",
  required: true,
  type: "password",
  maxlength: 10,
  minLength: 8,
}
