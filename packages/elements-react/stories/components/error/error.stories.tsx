// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowErrorFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Error, OryError } from "../../../src/theme/default"
import { config } from "../../utils"

const errors: Record<string, OryError> = {
  oidc_continuity: FlowErrorFromJSON(require("./errors/oidc_continuity.json")),
  oauth2: {
    error: "invalid_request",
    error_description:
      "The server could not handle your request, because it was malformed",
  },
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

export const GenericError: Story = {
  parameters: {
    date: new Date(Date.UTC(2025, 1, 1)),
  },
  args: {
    error: errors.oidc_continuity,
    config,
  },

  argTypes: {
    error: {
      options: Object.keys(errors),
      control: { type: "select" },
      mapping: errors,
    },
  },
}

export const GenericErrorWithSession: Story = {
  parameters: {
    date: new Date(Date.UTC(2025, 1, 1)),
  },
  args: {
    error: errors.oidc_continuity,
    session: {
      id: "session-id",
    },
    config,
  },

  argTypes: {
    error: {
      options: Object.keys(errors),
      control: { type: "select" },
      mapping: errors,
    },
  },
}
