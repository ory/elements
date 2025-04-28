// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../utils"
import { Login } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/Second Factor/Refresh/Lookup Secret",
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
      require("$snapshots/login/2fa/refresh/lookup_secret/initial-form.json"),
    ),
    config,
  },
}

export const InvalidLookupSecret: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/2fa/refresh/lookup_secret/invalid-lookup-secret.json"),
    ),
    config,
  },
}
