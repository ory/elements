// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryProxyOptions } from "./proxy"
import { joinUrlPaths } from "./utils"

/**
 * Replaces Ory URLs in `source` with URLs of the app, mapping the Ory Account
 * Experience pages to the pages configured in the project.
 *
 * @param source - The text to rewrite.
 * @param matchBaseUrl - The Ory SDK URL.
 * @param selfUrl - The origin of the app.
 * @param config - The proxy options.
 * @returns The rewritten text.
 * @internal
 */
export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  selfUrl: string,
  config: Pick<OryProxyOptions, "project">,
) {
  for (const [_, [matchPath, replaceWith]] of [
    // TODO load these dynamically from the project config

    // Old AX routes
    ["/ui/recovery", config.project?.recovery_ui_url],
    ["/ui/registration", config.project?.registration_ui_url],
    ["/ui/login", config.project?.login_ui_url],
    ["/ui/verification", config.project?.verification_ui_url],
    ["/ui/settings", config.project?.settings_ui_url],
    ["/ui/welcome", config.project?.default_redirect_url],

    // New AX routes
    ["/recovery", config.project?.recovery_ui_url],
    ["/registration", config.project?.registration_ui_url],
    ["/login", config.project?.login_ui_url],
    ["/verification", config.project?.verification_ui_url],
    ["/settings", config.project?.settings_ui_url],
  ].entries()) {
    const match = joinUrlPaths(matchBaseUrl, matchPath || "")
    if (replaceWith && source.startsWith(match)) {
      source = source.replaceAll(
        match,
        new URL(replaceWith, selfUrl).toString(),
      )
    }
  }
  return source.replaceAll(
    matchBaseUrl.replace(/\/$/, ""),
    new URL(selfUrl).toString().replace(/\/$/, ""),
  )
}
