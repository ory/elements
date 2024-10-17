import { OryClientConfiguration } from "@ory/elements-react"

let sdkUrl = process.env.ORY_SDK_URL || ""

export function setSdkUrl(url: string) {
  sdkUrl = url
}

export function getSdkUrl() {
  return sdkUrl
}

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
