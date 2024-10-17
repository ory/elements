import { OryClientConfiguration } from "@ory/elements-react"
import { getSdkUrl } from "@/fetch/sdk"

const config: OryClientConfiguration = {
  name: "Ory Elements example app",
  sdk: {
    url: getSdkUrl(),
  },
  project: {
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    recovery_ui_url: "/ui/recovery",
    registration_ui_url: "/ui/registration",
    verification_ui_url: "/ui/verification",
    login_ui_url: "/ui/login",
  },
}

export default config
