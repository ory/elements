import { Config } from "./types"
import { joinUrlPaths } from "./urls"

export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  config: Config,
) {
  for (const [index, [matchPath, replaceWith]] of [
    // TODO load these dynamically from the project config
    ["/ui/recovery", config.custom_recovery_ui_path],
    ["/ui/registration", config.custom_registration_ui_path],
    ["/ui/login", config.custom_login_ui_path],
    ["/ui/verification", config.custom_verification_ui_path],
    ["/ui/settings", config.custom_settings_ui_path],
  ].entries()) {
    const match = joinUrlPaths(matchBaseUrl, matchPath || "")
    if (source.startsWith("http")) {
      console.log({ replaceWith, match, matchBaseUrl, source })
    }
    if (replaceWith && source.startsWith(match)) {
      source = source.replaceAll(match, replaceWith)
    }
  }

  if (source.startsWith(matchBaseUrl)) {
    source = source.replaceAll(
      matchBaseUrl,
      config.proxyBasePath?.replace(/\/$/, "") ?? "",
    )
  }

  return source
}
