// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlow, LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"

const samlNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/saml/initial-form.json"),
)

const providers = [
  "okta",
  "auth0",
  "azure",
  "onelogin",
  "pingfederate",
  "gsuite",
]

const listOnly = (providers: string[]): LoginFlow => {
  return LoginFlowFromJSON({
    ...samlNodes,
    ui: {
      ...samlNodes.ui,
      nodes: samlNodes.ui.nodes.filter((node) => {
        if (
          node.group !== "saml" ||
          node.attributes.node_type !== "input" ||
          node.attributes.name !== "provider"
        ) {
          return true
        }

        return providers.includes(
          (node.attributes.value as string).toLowerCase(),
        )
      }),
    },
  })
}

const meta = {
  title: "Ory Elements/First Factor Login/Unified/Methods/SAML",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const OneSocialButton: Story = {
  args: {
    flow: listOnly(providers.slice(0, 1)),
    config,
  },
}

export const TwoSocialButtons: Story = {
  args: {
    flow: listOnly(providers.slice(0, 2)),
    config,
  },
}

export const ThreeSocialButtons: Story = {
  args: {
    flow: listOnly(providers.slice(0, 3)),
    config,
  },
}

export const FourSocialButtons: Story = {
  args: {
    flow: listOnly(providers.slice(0, 4)),
    config,
  },
}

export const FiveSocialButtons: Story = {
  args: {
    flow: listOnly(providers.slice(0, 5)),
    config,
  },
}

export const AllGenericButton: Story = {
  args: {
    flow: listOnly(providers),
    config,
  },
}

export const CredentialSelect: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/saml/credential-select.json"),
    ),
    config,
  },
}

export const CredentialSelectWithMethodSelect: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/saml/credential-select-password.json"),
    ),
    config,
  },
}
