// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Recovery } from "../../../src/theme/default"
import { config } from "../../utils"

const meta = {
  title: "Ory Elements/Recovery/Methods/Code",
  component: Recovery,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Recovery>

export default meta

type Story = StoryObj<typeof meta>

export const InitialForm: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery/code/initial-form.json"),
    ),
    config,
  },
}

export const MissingEmail: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery/code/missing-email.json"),
    ),
    config,
  },
}

export const SentCode: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery/code/sent-code.json"),
    ),
    config,
  },
}

export const WrongCode: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery/code/wrong-code.json"),
    ),
    config,
  },
}
