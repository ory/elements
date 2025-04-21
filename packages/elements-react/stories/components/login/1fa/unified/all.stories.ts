// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { config } from "../../../../utils"
import { Login } from "../../../../../src/theme/default"

const meta = {
  title: "Ory Elements/First Factor Login/Unified/Everything",
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
      require("$snapshots/login/1fa/all-methods/initial-form.json"),
    ),
    config,
  },
}

export const RegistrationDisabled: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/all-methods/initial-form.json"),
    ),
    config: {
      ...config,
      project: {
        ...config.project,
        registration_enabled: false,
      },
    },
  },
}

export const ValidationMissingFields: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/all-methods/missing-email.json"),
    ),
    config,
  },
}

export const ValidationIncorrectCredentials: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/all-methods/wrong-credentials.json"),
    ),
    config,
  },
}
