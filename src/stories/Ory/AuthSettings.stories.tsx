import { ComponentMeta, Story } from "@storybook/react"
import { UserSettingsCard, UserSettingsCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import { SelfServiceSettingsFlow } from "@ory/client"
import settingsFlow from "./settings-flow.json"

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
  flow: settingsFlow as SelfServiceSettingsFlow,
}

export const UserSettingsPasswordCard = Template.bind({})

UserSettingsPasswordCard.args = {
  flowType: "password",
  flow: settingsFlow as SelfServiceSettingsFlow,
}

export const UserSettingsWebauthnCard = Template.bind({})

UserSettingsWebauthnCard.args = {
  flowType: "webauthn",
  flow: settingsFlow as SelfServiceSettingsFlow,
}

export const UserSettingsTotpCard = Template.bind({})

UserSettingsTotpCard.args = {
  flowType: "totp",
  flow: settingsFlow as SelfServiceSettingsFlow,
}

export const UserSettingsOidcCard = Template.bind({})

UserSettingsOidcCard.args = {
  flowType: "oidc",
  flow: settingsFlow as SelfServiceSettingsFlow,
}
