// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Login } from "@ory/elements-react/theme"
import oidcNodes from "$/.stub-responses/login/1fa/oidc/initial-form.json"
import { config } from "../../../utils"
import { LoginFlow, LoginFlowFromJSON, UiNode } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"

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
]

const listOnly = (providers: string[]): LoginFlow => {
  return LoginFlowFromJSON({
    ...oidcNodes,
    ui: {
      ...oidcNodes.ui,
      nodes: oidcNodes.ui.nodes.filter((node) => {
        if (node.group !== "oidc") {
          return true
        }
        return providers.includes(node.attributes.value.toLowerCase())
      }) as UiNode[],
    },
  })
}

type LoginProxy = Record<(typeof providers)[number], boolean>

function LoginProxy(providers: LoginProxy) {
  const flow = providers
    ? listOnly(
        Object.keys(providers).filter(
          (key) => providers[key as keyof typeof providers],
        ),
      )
    : LoginFlowFromJSON(oidcNodes)

  return <Login flow={flow} config={config} />
}

const meta = {
  title: "Ory Elements/First Factor Login/Methods/Social Sign In",
  component: LoginProxy,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LoginProxy>

export default meta

type Story = StoryObj<typeof meta>

export const OneSocialButton: Story = {
  args: {
    google: true,
  },
}

export const TwoSocialButtons: Story = {
  args: {
    google: true,
    x: true,
  },
}

export const ThreeSocialButtons: Story = {
  args: {
    google: true,
    x: true,
    github: true,
  },
}

export const FourSocialButtons: Story = {
  args: {
    google: true,
    x: true,
    github: true,
    linkedin: true,
  },
}

export const FiveSocialButtons: Story = {
  args: {
    google: true,
    x: true,
    github: true,
    linkedin: true,
    auth0: true,
  },
}

export const SixSocialButtons: Story = {
  args: {
    google: true,
    x: true,
    github: true,
    linkedin: true,
    auth0: true,
    apple: true,
  },
}

export const SevenSocialButtons: Story = {
  args: {
    google: true,
    x: true,
    github: true,
    linkedin: true,
    auth0: true,
    apple: true,
    microsoft: true,
  },
}

export const AllGenericButton: Story = {
  args: {
    x: true,
    ...Object.keys(providers).reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<(typeof providers)[number], boolean>,
    ),
  },
}
