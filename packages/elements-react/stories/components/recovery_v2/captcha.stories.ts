// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { config } from "../../utils"
import { RecoveryFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Recovery } from "../../../src/theme/default"

const meta = {
  title: "Ory Elements/Recovery v2/Captcha",
  component: Recovery,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Recovery>

export default meta

type Story = StoryObj<typeof meta>

export const ShowFormInteractive: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/interactive/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormHidden: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/hidden/initial-form.json"),
    ),
    config,
  },
}

export const ShowFormClientError: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/client-error/initial-form.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedInteractive: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/interactive/wrong-captcha.json"),
    ),
    config,
  },
}

export const ValidationCaptchaUnsolvedHidden: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/hidden/wrong-captcha.json"),
    ),
    config,
  },
}

export const ShowSendInteractive: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/interactive/show-send.json"),
    ),
    config,
  },
}

export const ShowSendHidden: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/hidden/show-send.json"),
    ),
    config,
  },
}

export const ShowSendClientError: Story = {
  args: {
    flow: RecoveryFlowFromJSON(
      require("$snapshots/recovery_v2/captcha/client-error/show-send.json"),
    ),
    config,
  },
}
