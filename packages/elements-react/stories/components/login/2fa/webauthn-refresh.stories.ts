// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../utils"
import { Login } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/Second Factor/Refresh/WebAuthn",
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
      require("$snapshots/login/2fa/refresh/webauthn/initial-form.json"),
    ),
    config,
  },
}

export const WebAuthnError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/2fa/refresh/webauthn/webauthn-error.json"),
    ),
    config,
  },
}
