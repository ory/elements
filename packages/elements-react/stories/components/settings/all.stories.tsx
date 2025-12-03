// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlowFromJSON } from "@ory/client-fetch"
import { Meta, StoryObj } from "@storybook/react"
import { config } from "../../utils"
import { Settings } from "../../../src/theme/default"

const meta = {
  title: "Ory Elements/Settings/Everything",
  component: Settings,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Settings>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/all-methods/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormChangesSaved: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/all-methods/change-password.json"),
    ),
    config,
  },
}

export const ShowFormTraitValidationError: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/all-methods/change-trait.json"),
    ),
    config,
  },
}
