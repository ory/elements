// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { LoginFlowFromJSON, RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Registration } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Registration/Profile First/Password",
  component: Registration,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Registration>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/password/initial-form.json"),
    ),
    config,
  },
}

export const FirstStepValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/password/missing-fields.json"),
    ),
    config,
  },
}

export const EnterPassword: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/password/enter-password.json"),
    ),
    config,
  },
}

export const SecondStepValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/password/password-validation-error.json"),
    ),
    config,
  },
}
