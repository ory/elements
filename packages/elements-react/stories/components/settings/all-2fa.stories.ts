// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlowFromJSON } from "@ory/client-fetch"
import { Meta, StoryObj } from "@storybook/react"
import { config } from "../../utils"
import { SpacedSettings as Settings } from "./settings"

const meta = {
  title: "Ory Elements/Settings/Methods/Everything 2FA",
  component: Settings,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Settings>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/all-2fa-methods/initial-form.json"),
    ),
    config,
  },
}

export const ConfirmedLookupSecrets: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/all-2fa-methods/confirmed_lookup_secrets.json"),
    ),
    config,
  },
}

export const GeneratedLookupSecrets: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/all-2fa-methods/generated_lookup_secrets.json"),
    ),
    config,
  },
}

export const WithTotpAuthenticator: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$snapshots/settings/all-2fa-methods/with-totp-authenticator.json"),
    ),
    config,
  },
}
