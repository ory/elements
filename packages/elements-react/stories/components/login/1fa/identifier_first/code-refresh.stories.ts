// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"

const meta = {
  title:
    "Ory Elements/First Factor Login/Identifier First Refresh/Code",
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
      require("$snapshots/login/1fa/identifier_first/refresh/code/initial-form.json"),
    ),
    config,
  },
}

export const ValidationMissingFields: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/refresh/code/missing-code.json"),
    ),
    config,
  },
}

export const WrongCode: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/refresh/code/wrong-code.json"),
    ),
    config,
  },
}
