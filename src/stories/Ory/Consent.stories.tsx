import { ComponentProps } from "react"
import { ComponentMeta, Story } from "@storybook/react"

import { Container } from "../storyhelper"
import { UserConsentCard } from "../../react-components"
import logo from "../assets/logo.svg"

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
  requested_scope: ["openid"],
  client: { tos_uri: "asd", policy_uri: "asd" },
}
