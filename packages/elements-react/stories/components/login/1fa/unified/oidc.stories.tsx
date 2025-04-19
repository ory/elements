// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlow, LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"

const oidcNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/oidc/initial-form.json"),
)

const providers = [
  "apple",
  "auth0",
  "discord",
  "facebook",
  "generic",
  "github",
  "gitlab",
  "google",
  "linkedin",
  "microsoft",
  "slack",
  "spotify",
  "yandex",
  "x",
]

const listOnly = (providers: string[]): LoginFlow => {
  return LoginFlowFromJSON({
    ...oidcNodes,
    ui: {
      ...oidcNodes.ui,
      nodes: oidcNodes.ui.nodes.filter((node) => {
        if (node.group !== "oidc" || node.attributes.node_type !== "input") {
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
  title: "Ory Elements/First Factor Login/Unified/Methods/Social Sign In",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const OneSocialButton: Story = {
  args: {
    flow: listOnly(["google"]),
    config,
  },
}

export const TwoSocialButtons: Story = {
  args: {
    flow: listOnly(["google", "x"]),
    config,
  },
}

export const ThreeSocialButtons: Story = {
  args: {
    flow: listOnly(["google", "x", "github"]),
    config,
  },
}

export const FourSocialButtons: Story = {
  args: {
    flow: listOnly(["google", "x", "github", "linkedin"]),
    config,
  },
}

export const FiveSocialButtons: Story = {
  args: {
    flow: listOnly(["google", "x", "github", "linkedin", "auth0"]),
    config,
  },
}

export const SixSocialButtons: Story = {
  args: {
    flow: listOnly(["google", "x", "github", "linkedin", "auth0", "apple"]),
    config,
  },
}

export const SevenSocialButtons: Story = {
  args: {
    flow: listOnly([
      "google",
      "x",
      "github",
      "linkedin",
      "auth0",
      "apple",
      "microsoft",
    ]),
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
      require("$snapshots/login/1fa/oidc/credential-select.json"),
    ),
    config,
  },
}

export const CredentialSelectWithMethodSelect: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/oidc/credential-select-password.json"),
    ),
    config,
  },
}
