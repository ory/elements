// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { Login } from "../../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/First Factor/Identifier First/Passkey",
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
      require("$snapshots/login/1fa/identifier_first/passkey/initial-form.json"),
    ),
    config,
  },
}

export const MissingEmail: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/passkey/missing-email.json"),
    ),
    config,
  },
}

export const PasskeyTrigger: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/passkey/passkey-trigger.json"),
    ),
    config,
  },
}

export const PasskeyError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/passkey/passkey-error.json"),
    ),
    config,
  },
}
