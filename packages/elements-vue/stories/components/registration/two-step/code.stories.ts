// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { LoginFlowFromJSON, RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/vue3"
import { Registration } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Registration/Profile First/Code",
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
      require("$snapshots/registration/two-step/code/initial-form.json"),
    ),
    config,
  },
}

export const MissingEmail: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/code/missing-fields.json"),
    ),
    config,
  },
}

export const ShowCodeOption: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/code/show-options.json"),
    ),
    config,
  },
}

export const ShowCode: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/code/show-code-input.json"),
    ),
    config,
  },
}

export const WrongCode: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/code/wrong-code.json"),
    ),
    config,
  },
}
