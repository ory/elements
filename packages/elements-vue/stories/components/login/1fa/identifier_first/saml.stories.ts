// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { config, listOnlySsoProviders } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"

const samlNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/identifier_first/saml/with-password/initial-form.json"),
)

const providers = [
  "okta",
  "auth0",
  "azure",
  "onelogin",
  "pingfederate",
  "gsuite",
]

const meta = {
  title: "Ory Elements/Login/First Factor/Identifier First/SAML",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const OneSamlButton: Story = {
  args: {
    flow: listOnlySsoProviders(samlNodes, "saml", providers.slice(0, 1)),
    config,
  },
}

export const TwoSamlButtons: Story = {
  args: {
    flow: listOnlySsoProviders(samlNodes, "saml", providers.slice(0, 2)),
    config,
  },
}

export const ThreeSamlButtons: Story = {
  args: {
    flow: listOnlySsoProviders(samlNodes, "saml", providers.slice(0, 3)),
    config,
  },
}

export const FourSamlButtons: Story = {
  args: {
    flow: listOnlySsoProviders(samlNodes, "saml", providers.slice(0, 4)),
    config,
  },
}

export const FiveSamlButtons: Story = {
  args: {
    flow: listOnlySsoProviders(samlNodes, "saml", providers.slice(0, 5)),
    config,
  },
}

export const AllButtons: Story = {
  args: {
    flow: samlNodes,
    config,
  },
}

export const CredentialSelect: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/saml/credential-select.json"),
    ),
    config,
  },
}

export const CredentialSelectWithMethodSelect: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/saml/credential-select-password.json"),
    ),
    config,
  },
}

export const AllButtonsPasswordDisabled: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/saml/standalone/initial-form.json"),
    ),
    config,
  },
}
