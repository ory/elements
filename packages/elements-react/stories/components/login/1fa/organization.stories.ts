// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Login } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/First Factor/Identifier First/Organizations",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const ShowFormOIDC: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/organization-oidc/initial-form.json"),
    ),
    config,
  },
}

export const ShowOIDCOrganizationIDPs: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/organization-oidc/selected-email.json"),
    ),
    config,
  },
}

export const ShowFormSAML: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/organization-saml/initial-form.json"),
    ),
    config,
  },
}

export const ShowSAMLOrganizationIDPs: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/organization-saml/selected-email.json"),
    ),
    config,
  },
}
