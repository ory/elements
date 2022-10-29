import { ComponentMeta, Story } from "@storybook/react"
import { Card, CardProps, Message } from "../react-components"
import logo from "./assets/logo.svg"
import { Container } from "./storyhelper"

export default {
  title: "Component/Card",
  component: Card,
} as ComponentMeta<typeof Card>

const Template: Story<CardProps> = (args: CardProps) => (
  <Container>
    <Card {...args} />
  </Container>
)

export const NormalCard = Template.bind({})

NormalCard.args = {
  heading: "Normal Title",
  children: <Message severity="error">This is an error message.</Message>,
}

export const LogoHeadingCard = Template.bind({})

LogoHeadingCard.args = {
  heading: "Logo Heading",
  image: logo,
}
