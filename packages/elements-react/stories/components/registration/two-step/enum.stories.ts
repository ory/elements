// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Registration } from "../../../../src/theme/default"
import { config, reattachInputOptions } from "../../../utils"

const initialFormRaw: unknown = require("$snapshots/registration/two-step/enum/initial-form.json")

const meta = {
  title: "Ory Elements/Registration/Profile First/Enum",
  component: Registration,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Registration>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: reattachInputOptions(
      RegistrationFlowFromJSON(initialFormRaw),
      initialFormRaw,
    ),
    config,
  },
}
