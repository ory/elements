// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlow, LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../utils"
import { Login } from "../../../../src/theme/default"

const oidcNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/refresh/oidc/refresh.json"),
)

const meta = {
  title: "Ory Elements/Login/First Factor/Refresh/OIDC",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const OidcAndPassword: Story = {
  args: {
    flow: oidcNodes,
    config,
  },
}
