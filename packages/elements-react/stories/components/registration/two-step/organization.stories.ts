// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { LoginFlowFromJSON, RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Registration } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Registration/Profile First/Organizations",
  component: Registration,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Registration>

export default meta

type Story = StoryObj<typeof meta>

export const ShowSAMLForm: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/organization-saml/initial-form.json"),
    ),
    config,
  },
}
export const ShowSAMLOrganizationIDPs: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/organization-saml/organization-providers.json"),
    ),
    config,
  },
}

export const ShowOIDCForm: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/organization-oidc/initial-form.json"),
    ),
    config,
  },
}
export const ShowOIDCOrganizationIDPs: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/organization-oidc/organization-providers.json"),
    ),
    config,
  },
}
