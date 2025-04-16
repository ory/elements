// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { LoginFlowFromJSON, RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Registration } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Two Step Registration/Methods/Everything",
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
      require("$snapshots/registration/two-step/all-methods/initial-form.json"),
    ),
    config,
  },
}

export const FirstStepValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/all-methods/missing-fields.json"),
    ),
    config,
  },
}

export const ShowMethodChooser: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/all-methods/enter-password.json"),
    ),
    config,
  },
}

export const PasswordValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/all-methods/password-validation-error.json"),
    ),
    config,
  },
}

export const PasskeyValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/all-methods/passkey-error.json"),
    ),
    config,
  },
}

export const WebAuthnValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/all-methods/webauthn-error.json"),
    ),
    config,
  },
}

export const EmailCodeSent: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/all-methods/code-sent.json"),
    ),
    config,
  },
}

export const EmailCodeError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/all-methods/code-sent-error.json"),
    ),
    config,
  },
}
