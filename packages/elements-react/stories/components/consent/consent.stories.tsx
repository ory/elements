// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OAuth2ConsentRequest } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react-vite"
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

type ConsentChallengeWithResources = OAuth2ConsentRequest & {
  requested_resources?: string[]
}

const mockSession = {
  id: "UNSET",
  identity: {
    id: "UNSET",
    schema_id: "UNSET",
    schema_url: "UNSET",
    traits: { email: "john.doe@example.org" },
  },
}

export const GenericConsent: Story = {
  args: {
    consentChallenge: {
      challenge: "",
      client: {
        client_name: "Fake App",
      },
      requested_scope: ["openid", "offline_access"],
    },
    session: mockSession,
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
    session: mockSession,
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
    session: mockSession,
    config,
    csrfToken: "",
    formActionUrl: "/api/oauth2-polyfill/consent",
  },
}

export const RequestedResources: Story = {
  args: {
    consentChallenge: {
      challenge: "",
      client: {
        client_name: "Fake App",
      },
      requested_scope: ["openid", "offline_access"],
      requested_resources: [
        "https://api.example.com/calendar",
        "https://mcp.example.com/",
      ],
    } as ConsentChallengeWithResources,
    session: mockSession,
    config,
    csrfToken: "",
    formActionUrl: "/api/oauth2-polyfill/consent",
  },
}

export const RequestedResourcesLongUri: Story = {
  args: {
    consentChallenge: {
      challenge: "",
      client: {
        client_name: "Unlikely Very Long Client Name To Test UI Layout",
      },
      requested_scope: ["openid", "offline_access"],
      requested_resources: [
        "https://a-very-long-subdomain-name-for-testing.api.example.com/v1/tenants/0d9a3f5e-6c1b-4f7e-9a2d-8b3c4e5f6a7b/calendars/primary/events?include=attendees,reminders&expand=recurrence",
      ],
    } as ConsentChallengeWithResources,
    session: mockSession,
    config,
    csrfToken: "",
    formActionUrl: "/api/oauth2-polyfill/consent",
  },
}

export const RequestedResourcesOnly: Story = {
  args: {
    consentChallenge: {
      challenge: "",
      client: {
        client_name: "Fake App",
      },
      requested_scope: [],
      requested_resources: ["https://mcp.example.com/"],
    } as ConsentChallengeWithResources,
    session: mockSession,
    config,
    csrfToken: "",
    formActionUrl: "/api/oauth2-polyfill/consent",
  },
}
