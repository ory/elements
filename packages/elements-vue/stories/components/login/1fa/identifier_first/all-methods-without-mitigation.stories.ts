// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { config, patchMethodActive } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"
import options from "$snapshots/login/1fa/identifier_first/all-methods/enumeration-protection-enabled/show-options.json"
import { LoginFlowActiveEnum } from "@ory/client-fetch/src/models/LoginFlow"

const meta = {
  title:
    "Ory Elements/Login/First Factor/Identifier First/All Methods/Account Enumeration Mitigation Off",
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
      require("$snapshots/login/1fa/identifier_first/all-methods/enumeration-protection-disabled/initial-form.json"),
    ),
    config,
  },
}

export const ValidationUnknownAccount: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/all-methods/enumeration-protection-disabled/account-unknown.json"),
    ),
    config,
  },
}

export const ShowCredentialsSelector: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/all-methods/enumeration-protection-disabled/show-options.json"),
    ),
    config,
  },
}

export const PasswordSelected: Story = {
  args: {
    flow: patchMethodActive(
      LoginFlowFromJSON(options),
      LoginFlowActiveEnum.Password,
    ),
    config,
  },
}

export const CodeSelected: Story = {
  args: {
    flow: patchMethodActive(
      LoginFlowFromJSON(options),
      LoginFlowActiveEnum.Code,
    ),
    config,
  },
}
