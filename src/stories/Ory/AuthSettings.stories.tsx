// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { UserSettingsCard, UserSettingsCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import { settingsFlow, settingsUnlinkFlow } from "./settings-data"

export default {
  title: "Ory/UserSettingsCard",
  component: UserSettingsCard,
} as Meta<typeof UserSettingsCard>

const Template: StoryFn<UserSettingsCardProps> = (
  args: UserSettingsCardProps,
) => (
  <Container>
    <div style={{ width: "400px" }}>
      <UserSettingsCard {...args} />
    </div>
  </Container>
)

export const UserSettingsProfileCard = Template.bind({})

UserSettingsProfileCard.args = {
  method: "profile",
  flow: settingsFlow,
}

export const UserSettingsPasswordCard = Template.bind({})

UserSettingsPasswordCard.args = {
  method: "password",
  flow: settingsFlow,
}

export const UserSettingsWebauthnCard = Template.bind({})

UserSettingsWebauthnCard.args = {
  method: "webauthn",
  flow: settingsFlow,
}

export const UserSettingsUnlinkWebauthnCard = Template.bind({})

UserSettingsUnlinkWebauthnCard.args = {
  method: "webauthn",
  flow: settingsUnlinkFlow,
}

export const UserSettingsTotpCard = Template.bind({})

UserSettingsTotpCard.args = {
  method: "totp",
  flow: settingsFlow,
}

export const UserSettingsUnlinkTotpCard = Template.bind({})

UserSettingsUnlinkTotpCard.args = {
  method: "totp",
  flow: settingsUnlinkFlow,
}

export const UserSettingsOidcCard = Template.bind({})

UserSettingsOidcCard.args = {
  method: "oidc",
  flow: settingsFlow,
}

export const UserSettingsUnlinkOidcCard = Template.bind({})

UserSettingsUnlinkOidcCard.args = {
  method: "oidc",
  flow: settingsUnlinkFlow,
}
