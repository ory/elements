// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from "@storybook/react"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import { Login } from "../../../../../src/theme/default"
import { config, listOnlySsoProviders } from "../../../../utils"

const meta = {
  title: "Ory Elements/Login/First Factor/Identifier First/OIDC",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

const oidcNodes = LoginFlowFromJSON(
  require("$snapshots/login/1fa/identifier_first/oidc/with-password/initial-form.json"),
)

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

export const CredentialSelect: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/oidc/credential-select.json"),
    ),
    config,
  },
}

export const CredentialSelectWithMethodSelect: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/oidc/credential-select-password.json"),
    ),
    config,
  },
}

export const AllButtonsPasswordDisabled: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/oidc/standalone/initial-form.json"),
    ),
    config,
  },
}

export const MissingFields: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/oidc/with-password/missing-fields.json"),
    ),
    config,
  },
}

export const MissingFieldsPasswordDisabled: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/oidc/standalone/missing-fields.json"),
    ),
    config,
  },
}
