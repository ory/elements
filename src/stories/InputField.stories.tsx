import { ComponentMeta, Story } from "@storybook/react"
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
