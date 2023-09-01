import { UserConsentCard } from "../../react-components"
import logo from "../assets/logo.svg"
import { Container } from "../storyhelper"
import { ComponentMeta, Story } from "@storybook/react"
import { ComponentProps } from "react"

export default {
  title: "Ory/UserConsentCard",
  component: UserConsentCard,
} as ComponentMeta<typeof UserConsentCard>

const Template: Story<ComponentProps<typeof UserConsentCard>> = (
  args: ComponentProps<typeof UserConsentCard>,
) => (
  <Container>
    <UserConsentCard {...args} />
  </Container>
)

export const ConsentCard = Template.bind({})
ConsentCard.args = {
  cardImage: logo,
  requested_scope: ["openid", "test_scope"],
  client: { tos_uri: "example.com/", policy_uri: "example.com/" },
}
