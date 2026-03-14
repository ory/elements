// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { Login } from "../../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/First Factor/Unified/Password",
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
      require("$snapshots/login/1fa/unified/password/initial-form.json"),
    ),
    config,
  },
}

export const ValidationMissingFields: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/unified/password/missing-email.json"),
    ),
    config,
  },
}

export const ValidationIncorrectCredentials: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/unified/password/wrong-credentials.json"),
    ),
    config,
  },
}
