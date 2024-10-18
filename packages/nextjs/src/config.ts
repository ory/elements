import { OryConfig } from "./types"
import { OryClientConfiguration } from "@ory/elements-react"
import { getSdkUrl } from "./sdk"

export function useOryConfig(
  config: Partial<OryConfig>,
): OryClientConfiguration {
  // TODO load this info from the server

  return {
    name: config.override?.applicationName ?? "Default name",
    sdk: {
      url: getSdkUrl(),
    },
    project: {
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,
      recovery_ui_url: config.override?.recovery_ui_path ?? "/ui/recovery",
      registration_ui_url:
        config.override?.registration_ui_path ?? "/ui/registration",
      verification_ui_url:
        config.override?.verification_ui_path ?? "/ui/verification",
      login_ui_url: config.override?.login_ui_path ?? "/ui/login",
    },
  }
}
