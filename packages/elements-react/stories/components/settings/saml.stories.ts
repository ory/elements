// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlowFromJSON } from "@ory/client-fetch"
import { Meta, StoryObj } from "@storybook/react"
import { config } from "../../utils"
import { SpacedSettings as Settings } from "./settings"

const meta = {
  title: "Ory Elements/Settings/SAML",
  component: Settings,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Settings>

export default meta

type Story = StoryObj<typeof meta>

export const WithUnlinkProvider: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/saml/with-provider.json"),
    ),
    config,
  },
}
