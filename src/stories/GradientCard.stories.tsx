import { ComponentMeta, Story } from "@storybook/react"
import { CardGradient, CardGradientProps } from "../react-components"
import { Container } from "./storyhelper"

export default {
  title: "Component/CardGradient",
  component: CardGradient,
} as ComponentMeta<typeof CardGradient>

const Template: Story<CardGradientProps> = (args: CardGradientProps) => (
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
