// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Recovery } from "../../../src/theme/default"
import { config } from "../../utils"

const meta = {
  title: "Ory Elements/Recovery v2/Code",
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
      require("$snapshots/recovery-v2/code/initial-form.json"),
    ),
    config,
  },
}

export const MissingAddress: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery-v2/code/missing-any-address.json"),
    ),
    config,
  },
}

export const SelectIdentifier: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery-v2/code/select-identifier.json"),
    ),
    config,
  },
}

export const ConfirmIdentifier: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery-v2/code/confirm-identifier.json"),
    ),
    config,
  },
}

export const CodeSent: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery-v2/code/code-sent.json"),
    ),
    config,
  },
}

export const WrongCode: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery-v2/code/wrong-code.json"),
    ),
    config,
  },
}
