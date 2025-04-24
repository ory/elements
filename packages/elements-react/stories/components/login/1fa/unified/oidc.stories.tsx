// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  LoginFlow,
  LoginFlowFromJSON,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config, listOnlyGroups, listOnlySsoProviders } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"

const oidcNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/unified/oidc/with-password/initial-form.json"),
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

const meta = {
  title: "Ory Elements/Login/First Factor/Unified/OIDC",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const OneSocialButton: Story = {
  args: {
    flow: listOnlySsoProviders(LoginFlowFromJSON(oidcNodes), "oidc", [
      "google",
    ]),
    config,
  },
}

export const TwoSocialButtons: Story = {
  args: {
    flow: listOnlySsoProviders(LoginFlowFromJSON(oidcNodes), "oidc", [
      "google",
      "x",
    ]),
    config,
  },
}

export const ThreeSocialButtons: Story = {
  args: {
    flow: listOnlySsoProviders(LoginFlowFromJSON(oidcNodes), "oidc", [
      "google",
      "x",
      "github",
    ]),
    config,
  },
}

export const FourSocialButtons: Story = {
  args: {
    flow: listOnlySsoProviders(LoginFlowFromJSON(oidcNodes), "oidc", [
      "google",
      "x",
      "github",
      "linkedin",
    ]),
    config,
  },
}

export const FiveSocialButtons: Story = {
  args: {
    flow: listOnlySsoProviders(LoginFlowFromJSON(oidcNodes), "oidc", [
      "google",
      "x",
      "github",
      "linkedin",
      "auth0",
    ]),
    config,
  },
}

export const SixSocialButtons: Story = {
  args: {
    flow: listOnlySsoProviders(LoginFlowFromJSON(oidcNodes), "oidc", [
      "google",
      "x",
      "github",
      "linkedin",
      "auth0",
      "apple",
    ]),
    config,
  },
}

export const SevenSocialButtons: Story = {
  args: {
    flow: listOnlySsoProviders(LoginFlowFromJSON(oidcNodes), "oidc", [
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

export const AllButtons: Story = {
  args: {
    flow: LoginFlowFromJSON(oidcNodes),
    config,
  },
}

export const AllButtonsPasswordDisabled: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/unified/oidc/standalone/initial-form.json"),
    ),
    config,
  },
}
