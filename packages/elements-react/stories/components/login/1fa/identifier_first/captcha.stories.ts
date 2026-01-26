// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Login } from "../../../../../src/theme/default"

const meta = {
  title: "Ory Elements/Login/First Factor/Identifier First/Captcha",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const ShowFormInteractive: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/interactive/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormHidden: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/hidden/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormClientError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/client-error/initial-form.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedInteractive: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/interactive/wrong-captcha.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedHidden: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/hidden/wrong-captcha.json"),
    ),
    config,
  },
}

export const MethodSelectHidden: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/hidden/show-options.json"),
    ),
    config,
  },
}

export const MethodSelectInteractive: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/interactive/show-options.json"),
    ),
    config,
  },
}

export const MethodSelectClientError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/client-error/show-options.json"),
    ),
    config,
  },
}

export const CodeSentHidden: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/hidden/show-send.json"),
    ),
    config,
  },
}

export const CodeSentInteractive: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/interactive/show-send.json"),
    ),
    config,
  },
}

export const CodeSentClientError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/identifier_first/captcha/client-error/show-send.json"),
    ),
    config,
  },
}
