import { ComponentProps } from "react"
import { Meta, StoryFn } from "@storybook/react"

import { Container } from "../storyhelper"
import {
  UserSettingsScreen,
  UserSettingsScreenProps,
} from "../../react-components"

import { settingsFlow } from "./settings-data"

const Screen = (props: UserSettingsScreenProps) => (
  <div style={{ display: "flex", flexDirection: "row" }}>
    <UserSettingsScreen.Nav {...props} />
    <div style={{ margin: "4rem" }}>
      <UserSettingsScreen.Body {...props} />
    </div>
  </div>
)

export default {
  title: "Ory/SettingsScreen",
  component: Screen,
} as Meta<typeof Screen>

const Template: StoryFn<ComponentProps<typeof Screen>> = (args) => (
  <Container>
    <Screen {...args} />
  </Container>
)

export const SettingsScreen = Template.bind({})
SettingsScreen.args = {
  flow: settingsFlow,
  logoutUrl: "https://www.ory.sh",
}
