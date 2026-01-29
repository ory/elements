// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { config, patchMethodActive } from "../../../utils"
import { Login } from "../../../../src/theme/default"
import { LoginFlowActiveEnum } from "@ory/client-fetch/src/models/LoginFlow"

const meta = {
  title: "Ory Elements/Login/Second Factor/Refresh/All Methods",
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
      require("$snapshots/login/2fa/refresh/all-methods/initial-form.json"),
    ),
    config,
  },
}

export const LookupSecretSelected: Story = {
  args: {
    flow: patchMethodActive(
      LoginFlowFromJSON(
        require("$snapshots/login/2fa/refresh/all-methods/initial-form.json"),
      ),
      LoginFlowActiveEnum.LookupSecret,
    ),
    config,
  },
}

export const TOTPSelected: Story = {
  args: {
    flow: patchMethodActive(
      LoginFlowFromJSON(
        require("$snapshots/login/2fa/refresh/all-methods/initial-form.json"),
      ),
      LoginFlowActiveEnum.Totp,
    ),
    config,
  },
}

export const WebAuthnSelected: Story = {
  args: {
    flow: patchMethodActive(
      LoginFlowFromJSON(
        require("$snapshots/login/2fa/refresh/all-methods/initial-form.json"),
      ),
      LoginFlowActiveEnum.Webauthn,
    ),
    config,
  },
}

export const CodeSelected: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/2fa/refresh/all-methods/code-form.json"),
    ),
    config,
  },
}
