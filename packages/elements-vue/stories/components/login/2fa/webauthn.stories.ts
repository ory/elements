// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { config } from "../../../utils"
import { Login } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/Second Factor/WebAuthn",
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
      require("$snapshots/login/2fa/webauthn/initial-form.json"),
    ),
    config,
  },
}

export const WebAuthnError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/2fa/webauthn/webauthn-error.json"),
    ),
    config,
  },
}
