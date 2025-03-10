// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ErrorGenericFromJSON, GenericErrorFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Error, OryError } from "../../../src/theme/default"
import { config } from "../../utils"

const errors: Record<string, OryError> = {
  recovery_disabled: ErrorGenericFromJSON(
    require("$snapshots/recovery/disabled/initial-form.json"),
  ),
}

const meta = {
  title: "Ory Elements/Error",
  component: Error,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Error>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    error: errors.recovery_disabled,
    config,
  },
}
