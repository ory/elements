import { ComponentMeta, Story } from "@storybook/react"
import { Checkbox, CheckboxProps, Message } from "../react-components"
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

export const CheckboxWithLabel = Template.bind({})

CheckboxWithLabel.args = {
  label: "I agree to the terms and conditions",
  required: true,
}

export const CheckboxWithHelperText = Template.bind({})

CheckboxWithHelperText.args = {
  label: "I agree to the terms and conditions",
  helperMessage: "Password must be at least 8 characters long",
  severity: "error",
}

export const CheckboxWithMessageComponentHelperText = Template.bind({})

CheckboxWithMessageComponentHelperText.args = {
  label: "I agree to the terms and conditions",
  helperMessage: (
    <Message severity="error" textPosition="start">
      You must agree to the terms and conditions
    </Message>
  ),
}
