// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Settings } from "../../../src/theme/default"
import { config, reattachInputOptions } from "../../utils"

const initialFormRaw: unknown = require("$snapshots/settings/enum/initial-form.json")

const meta = {
  title: "Ory Elements/Settings/Enum Traits",
  component: Settings,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Settings>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: reattachInputOptions(
      SettingsFlowFromJSON(initialFormRaw),
      initialFormRaw,
    ),
    config,
  },
}
