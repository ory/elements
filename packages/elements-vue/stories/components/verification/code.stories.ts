// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { VerificationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { Verification } from "../../../src/theme/default"
import { config } from "../../utils"

const meta = {
  title: "Ory Elements/Verification/Code",
  component: Verification,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Verification>

export default meta

type Story = StoryObj<typeof meta>

export const InitialForm: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/code/initial-form.json"),
    ),
    config,
  },
}

export const MissingEmail: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/code/missing-email.json"),
    ),
    config,
  },
}

export const SentCode: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/code/sent-code.json"),
    ),
    config,
  },
}

export const WrongCode: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/code/wrong-code.json"),
    ),
    config,
  },
}
