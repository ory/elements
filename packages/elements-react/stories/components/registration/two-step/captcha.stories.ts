// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../utils"
import { RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Registration } from "../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Registration/Profile First/Captcha",
  component: Registration,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Registration>

export default meta

type Story = StoryObj<typeof meta>

export const ShowFormInteractive: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/interactive/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormHidden: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/hidden/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormClientError: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/client-error/initial-form.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedInteractive: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/interactive/wrong-captcha.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedHidden: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/hidden/wrong-captcha.json"),
    ),
    config,
  },
}

export const MethodSelectInteractive: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/interactive/show-options.json"),
    ),
    config,
  },
}

export const MethodSelectHidden: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/hidden/show-options.json"),
    ),
    config,
  },
}

export const MethodSelectClientError: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/client-error/show-options.json"),
    ),
    config,
  },
}

export const ShowSendInteractive: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/interactive/show-send.json"),
    ),
    config,
  },
}

export const ShowSendHidden: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/hidden/show-send.json"),
    ),
    config,
  },
}

export const ShowSendClientError: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$snapshots/registration/two-step/captcha/client-error/show-send.json"),
    ),
    config,
  },
}
