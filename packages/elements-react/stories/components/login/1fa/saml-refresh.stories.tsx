// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../utils"
import { Login } from "../../../../src/theme/default"

const samlNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/refresh/saml/refresh.json"),
)

const meta = {
  title: "Ory Elements/Login/First Factor/Refresh/SAML",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const SamlAndPassword: Story = {
  args: {
    flow: samlNodes,
    config,
  },
}
