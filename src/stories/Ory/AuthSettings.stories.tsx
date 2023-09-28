import { ComponentMeta, Story } from "@storybook/react"
import { UserSettingsCard, UserSettingsCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import { settingsFlow, settingsUnlinkFlow } from "./settings-data"

export default {
  title: "Ory/UserSettingsCard",
  component: UserSettingsCard,
} as ComponentMeta<typeof UserSettingsCard>

const Template: Story<UserSettingsCardProps> = (
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
  flowType: "profile",
  flow: settingsFlow,
}

export const UserSettingsPasswordCard = Template.bind({})

UserSettingsPasswordCard.args = {
  flowType: "password",
  flow: settingsFlow,
}

export const UserSettingsWebauthnCard = Template.bind({})

UserSettingsWebauthnCard.args = {
  flowType: "webauthn",
  flow: settingsFlow,
}

export const UserSettingsUnlinkWebauthnCard = Template.bind({})

UserSettingsUnlinkWebauthnCard.args = {
  flowType: "webauthn",
  flow: settingsUnlinkFlow,
}

export const UserSettingsTotpCard = Template.bind({})

UserSettingsTotpCard.args = {
  flowType: "totp",
  flow: settingsFlow,
}

export const UserSettingsUnlinkTotpCard = Template.bind({})

UserSettingsUnlinkTotpCard.args = {
  flowType: "totp",
  flow: settingsUnlinkFlow,
}

export const UserSettingsOidcCard = Template.bind({})

UserSettingsOidcCard.args = {
  flowType: "oidc",
  flow: settingsFlow,
}

export const UserSettingsUnlinkOidcCard = Template.bind({})

UserSettingsUnlinkOidcCard.args = {
  flowType: "oidc",
  flow: settingsUnlinkFlow,
}
