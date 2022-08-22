import React from "react"
import { Story, ComponentMeta } from "@storybook/react"
import { Container } from "./storyhelper"
import { Card, CardProps, Message } from "../react-components"

export default {
  title: "Component/Card",
  component: Card,
  argTypes: {
    theme: {
      options: ["light", "dark"],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof Card>

const Template: Story<CardProps> = (args: CardProps) => (
  <Container theme={"light"}>
    <Card {...args} />
  </Container>
)

export const NormalCard = Template.bind({})

NormalCard.args = {
  title: "Normal Title",
  children: <Message severity="error">This is an error message.</Message>,
}
