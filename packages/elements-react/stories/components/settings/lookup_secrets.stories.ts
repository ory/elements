// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlowFromJSON } from "@ory/client-fetch"
import { Meta, StoryObj } from "@storybook/react"
import { config } from "../../utils"
import { Settings } from "../../../src/theme/default"

const meta = {
  title: "Ory Elements/Settings/Lookup Secret",
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
      require("$snapshots/settings/lookup_secret/initial-form.json"),
    ),
    config,
  },
}

export const ConfirmedLookupSecrets: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/lookup_secret/confirmed_lookup_secrets.json"),
    ),
    config,
  },
}

export const GeneratedLookupSecrets: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/lookup_secret/generated_lookup_secrets.json"),
    ),
    config,
  },
}
