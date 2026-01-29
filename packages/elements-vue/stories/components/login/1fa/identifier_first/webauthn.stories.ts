// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { Login } from "../../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/First Factor/Identifier First/WebAuthn",
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
      require("$snapshots/login/1fa/identifier_first/webauthn/initial-form.json"),
    ),
    config,
  },
}

export const MissingEmail: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/webauthn/missing-email.json"),
    ),
    config,
  },
}

export const WebAuthnTrigger: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/webauthn/webauthn-trigger.json"),
    ),
    config,
  },
}

export const WebAuthnError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/webauthn/webauthn-error.json"),
    ),
    config,
  },
}
