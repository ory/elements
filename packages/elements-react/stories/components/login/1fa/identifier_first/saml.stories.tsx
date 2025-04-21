// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlow, LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config, listOnly } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"

const samlNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/identifier_first/saml/initial-form.json"),
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
  title: "Ory Elements/First Factor Login/Identifier First/SAML",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const OneSamlButton: Story = {
  args: {
    flow: listOnly(samlNodes, "saml", providers.slice(0, 1)),
    config,
  },
}

export const TwoSamlButtons: Story = {
  args: {
    flow: listOnly(samlNodes, "saml", providers.slice(0, 2)),
    config,
  },
}

export const ThreeSamlButtons: Story = {
  args: {
    flow: listOnly(samlNodes, "saml", providers.slice(0, 3)),
    config,
  },
}

export const FourSamlButtons: Story = {
  args: {
    flow: listOnly(samlNodes, "saml", providers.slice(0, 4)),
    config,
  },
}

export const FiveSamlButtons: Story = {
  args: {
    flow: listOnly(samlNodes, "saml", providers.slice(0, 5)),
    config,
  },
}

export const AllGenericButton: Story = {
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
