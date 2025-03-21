// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from "@storybook/react"
import { Consent } from "../../../src/theme/default"
import { config } from "../../utils"

const meta = {
  title: "Ory Elements/Consent",
  component: Consent,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Consent>

export default meta

type Story = StoryObj<typeof meta>

export const GenericConsent: Story = {
  args: {
    consentChallenge: {
      challenge: "",
      client: {
        client_name: "Fake App",
      },
      requested_scope: ["openid", "offline_access"],
    },
    session: { id: "UNSET" },
    config,
    csrfToken: "",
    formActionUrl: "/api/oauth2-polyfill/consent",
  },
}

export const AllOIDCScopes: Story = {
  args: {
    consentChallenge: {
      challenge: "",
      client: {
        client_name: "Fake App",
      },
      requested_scope: [
        "openid",
        "offline_access",
        "profile",
        "email",
        "address",
        "phone",
      ],
    },
    session: { id: "UNSET" },
    config,
    csrfToken: "",
    formActionUrl: "/api/oauth2-polyfill/consent",
  },
}

export const CustomScopes: Story = {
  args: {
    consentChallenge: {
      challenge: "",
      client: {
        client_name: "Unlikely Very Long Client Name To Test UI Layout",
      },
      requested_scope: [
        "cutom",
        "custom_two",
        "foo:bar",
        "ridiculously_long_scope_name_to_test_ui_layout",
      ],
    },
    session: { id: "UNSET" },
    config,
    csrfToken: "",
    formActionUrl: "/api/oauth2-polyfill/consent",
  },
}
