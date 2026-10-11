// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from "@storybook/vue3"
import { VerificationFlowFromJSON } from "@ory/client-fetch"
import { Verification } from "../../src/theme/default"
import { config } from "../utils"
import MyCustomCardHeader from "./components/MyCustomCardHeader.vue"

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
