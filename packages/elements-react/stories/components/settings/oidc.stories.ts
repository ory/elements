// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlowFromJSON } from "@ory/client-fetch"
import { Meta, StoryObj } from "@storybook/react"
import { config } from "../../utils"
import { Settings } from "../../../src/theme/default"

const meta = {
  title: "Ory Elements/Settings/OIDC",
  component: Settings,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Settings>

export default meta

type Story = StoryObj<typeof meta>

export const WithUnlinkProvider: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/oidc/with-provider.json"),
    ),
    config,
  },
}
