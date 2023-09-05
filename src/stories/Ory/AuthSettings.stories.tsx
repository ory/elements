import { UserSettingsCard, UserSettingsCardProps } from "../../react-components"
import { Container } from "../storyhelper"
import settingsFlow from "./settings-flow.json"
import settingsUnlinkFlow from "./settings-unlink-flow.json"
import { SettingsFlow } from "@ory/client"
import { ComponentMeta, Story } from "@storybook/react"

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
  flow: settingsFlow as SettingsFlow,
}

export const UserSettingsPasswordCard = Template.bind({})

UserSettingsPasswordCard.args = {
  flowType: "password",
  flow: settingsFlow as SettingsFlow,
}

export const UserSettingsWebauthnCard = Template.bind({})

UserSettingsWebauthnCard.args = {
  flowType: "webauthn",
  flow: settingsFlow as SettingsFlow,
}

export const UserSettingsUnlinkWebauthnCard = Template.bind({})

UserSettingsUnlinkWebauthnCard.args = {
  flowType: "webauthn",
  flow: settingsUnlinkFlow as SettingsFlow,
}

export const UserSettingsTotpCard = Template.bind({})

UserSettingsTotpCard.args = {
  flowType: "totp",
  flow: settingsFlow as SettingsFlow,
}

export const UserSettingsUnlinkTotpCard = Template.bind({})

UserSettingsUnlinkTotpCard.args = {
  flowType: "totp",
  flow: settingsUnlinkFlow as SettingsFlow,
}

export const UserSettingsOidcCard = Template.bind({})

UserSettingsOidcCard.args = {
  flowType: "oidc",
  flow: settingsFlow as SettingsFlow,
}

export const UserSettingsUnlinkOidcCard = Template.bind({})

UserSettingsUnlinkOidcCard.args = {
  flowType: "oidc",
  flow: settingsUnlinkFlow as SettingsFlow,
}
