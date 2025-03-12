// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Login } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Two Step Registration/Methods/Captcha",
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
      require("$snapshots/registration/two-step/captcha/initial-form.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolved: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/wrong-captcha.json"),
    ),
    config,
  },
}
