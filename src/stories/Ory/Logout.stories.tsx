import { UserLogoutCard } from "../../react-components"
import logo from "../assets/logo.svg"
import { Container } from "../storyhelper"
import { ComponentMeta, Story } from "@storybook/react"
import { ComponentProps } from "react"

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
