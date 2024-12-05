// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps } from "react"
import { Meta, StoryFn } from "@storybook/react"

import { Container } from "../storyhelper"
import { UserLogoutCard } from "../../react-components"
import logo from "../assets/logo.svg"

export default {
  title: "Ory/UserLogoutCard",
  component: UserLogoutCard,
} as Meta<typeof UserLogoutCard>

const Template: StoryFn<ComponentProps<typeof UserLogoutCard>> = (args) => (
  <Container>
    <UserLogoutCard {...args} />
  </Container>
)

export const LogoutCard = Template.bind({})
LogoutCard.args = {
  cardImage: logo,
}
