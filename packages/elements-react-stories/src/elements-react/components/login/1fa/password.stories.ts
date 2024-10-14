// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Login } from "@ory/elements-react/theme"
import { config } from "../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Ory Elements/First Factor Login/Methods/Password",
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
      require("$/.stub-responses/login/1fa/password/initial-form.json"),
    ),
    config,
  },
}

export const ValidationMissingFields: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/login/1fa/password/missing-email.json"),
    ),
    config,
  },
}

export const ValidationIncorrectCredentials: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/login/1fa/password/wrong-credentials.json"),
    ),
    config,
  },
}
