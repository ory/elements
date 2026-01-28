// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from "@storybook/react"
import { Verification } from "../../src/theme/default"
import { config } from "../utils"
import { VerificationFlowFromJSON } from "@ory/client-fetch"
import { MyCustomCardHeader } from "./components/card-header"

const meta = {
  title: "Ory Elements/Custom components/Card Header",
  component: Verification,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Verification>

export default meta

type Story = StoryObj<typeof meta>

// See https://github.com/ory/elements/issues/575
export const CustomizedCardHeader: Story = {
  args: {
    // This is just a placeholder story to demonstrate customized input styles.
    // Replace with actual args as needed.

    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/code/initial-form.json"),
    ),
    config: config,
    components: {
      Card: {
        Header: MyCustomCardHeader,
      },
    },
  },
}
