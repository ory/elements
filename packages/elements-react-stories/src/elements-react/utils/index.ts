import { OryClientConfiguration } from "@ory/elements-react"

export const config = {
  name: "Acme Inc.",
  sdk: {
    url: "",
  },
  project: {
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    login_ui_url: "",
    recovery_ui_url: "",
    registration_ui_url: "",
    verification_ui_url: "",
  },
} satisfies OryClientConfiguration
