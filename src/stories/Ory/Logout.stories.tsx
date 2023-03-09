import { ComponentProps } from "react"
import { ComponentMeta, Story } from "@storybook/react"

import { Container } from "../storyhelper"
import { UserLogoutCard } from "../../react-components"
import logo from "../assets/logo.svg"

export default {
  title: "Ory/UserLogoutCard",
  component: UserLogoutCard,
} as ComponentMeta<typeof UserLogoutCard>

const Template: Story<ComponentProps<typeof UserLogoutCard>> = (args) => (
  <Container>
    <UserLogoutCard {...args} />
  </Container>
)

export const LogoutCard = Template.bind({})
LogoutCard.args = {
  cardImage: logo,
}
