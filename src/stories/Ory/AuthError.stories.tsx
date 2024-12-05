// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { UserErrorCard, UserErrorCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import { authError400, authError500 } from "./auth-error-data"

export default {
  title: "Ory/ErrorAuthCard",
  component: UserErrorCard,
} as Meta<typeof UserErrorCard>

const Template: StoryFn<UserErrorCardProps> = (args: UserErrorCardProps) => (
  <Container>
    <UserErrorCard {...args} />
  </Container>
)

export const ErrorAuthCard400 = Template.bind({})

ErrorAuthCard400.args = {
  error: authError400,
  backUrl: "https://acme.com/login",
  contactSupportEmail: "help@help.com",
}

export const ErrorAuthCard500 = Template.bind({})

ErrorAuthCard500.args = {
  error: authError500,
  backUrl: "https://acme.com/login",
  contactSupportEmail: "help@help.com",
}
