import { OryConfig } from "./types"
import { joinUrlPaths } from "./urls"

export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  selfUrl: string,
  config: OryConfig,
) {
  for (const [_, [matchPath, replaceWith]] of [
    // TODO load these dynamically from the project config
    ["/ui/recovery", config.override?.recovery_ui_path],
    ["/ui/registration", config.override?.registration_ui_path],
    ["/ui/login", config.override?.login_ui_path],
    ["/ui/verification", config.override?.verification_ui_path],
    ["/ui/settings", config.override?.settings_ui_path],
  ].entries()) {
    const match = joinUrlPaths(matchBaseUrl, matchPath || "")
    if (replaceWith && source.startsWith(match)) {
      source = source.replaceAll(
        match,
        new URL(replaceWith, selfUrl).toString(),
      )
    }
  }

  if (source.startsWith(matchBaseUrl)) {
    source = source.replaceAll(
      matchBaseUrl.replace(/\/$/, ""),
      new URL(selfUrl).toString().replace(/\/$/, ""),
    )
  }

  return source
}
