// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { config } from "../../../utils"
import { Login } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/First Factor/Account Linking",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/account_linking/initial-form.json"),
    ),
    config,
  },
}
