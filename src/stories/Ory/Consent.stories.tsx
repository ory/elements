// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

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
  requested_scope: ["openid", "test_scope"],
  client: { tos_uri: "example.com/", policy_uri: "example.com/" },
}
