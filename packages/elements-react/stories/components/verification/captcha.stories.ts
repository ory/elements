// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../utils"
import { VerificationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Verification } from "../../../src/theme/default"

const meta = {
  title: "Ory Elements/Verification/Captcha",
  component: Verification,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Verification>

export default meta

type Story = StoryObj<typeof meta>

export const ShowFormInteractive: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/interactive/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormHidden: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/hidden/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormClientError: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/client-error/initial-form.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedInteractive: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/interactive/wrong-captcha.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedHidden: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/hidden/wrong-captcha.json"),
    ),
    config,
  },
}

export const ShowSendInteractive: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/interactive/show-send.json"),
    ),
    config,
  },
}

export const ShowSendHidden: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/hidden/show-send.json"),
    ),
    config,
  },
}

export const ShowSendClientError: Story = {
  args: {
    flow: VerificationFlowFromJSON(
      require("$snapshots/verification/captcha/client-error/show-send.json"),
    ),
    config,
  },
}
