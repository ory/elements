// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { LoginFlowFromJSON, RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Registration } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Registration/Unified/Everything",
  component: Registration,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Registration>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/one-step/all-methods/initial-form.json"),
    ),
    config,
  },
}

export const ValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/one-step/all-methods/missing-fields.json"),
    ),
    config,
  },
}
