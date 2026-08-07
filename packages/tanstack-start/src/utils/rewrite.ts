// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryMiddlewareOptions } from "../types"

function rewriteValue(value: unknown, from: string, to: string): unknown {
  if (typeof value === "string") {
    return value.replaceAll(from, to)
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => rewriteValue(item, from, to))
      .filter((item) => item !== undefined)
  }
  if (
    value !== null &&
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, rewriteValue(item, from, to)]),
    )
  }
  return value
}

export function rewriteJsonResponse<T>(
  value: T,
  sdkUrl: string,
  browserSdkUrl: string,
): T {
  return rewriteValue(
    value,
    sdkUrl.replace(/\/$/, ""),
    browserSdkUrl.replace(/\/$/, ""),
  ) as T
}

function joinUrlPaths(baseUrl: string, relativePath: string): string {
  const base = new URL(baseUrl)
  const relative = new URL(relativePath, base)
  relative.pathname =
    base.pathname.replace(/\/$/, "") +
    "/" +
    relative.pathname.replace(/^\//, "")
  return relative.toString()
}

export function rewriteConfiguredUiRoutes(
  source: string,
  sdkUrl: string,
  appUrl: string,
  options: OryMiddlewareOptions,
): string {
  const routes: Array<[string, string | undefined]> = [
    ["/ui/recovery", options.project.recovery_ui_url],
    ["/ui/registration", options.project.registration_ui_url],
    ["/ui/login", options.project.login_ui_url],
    ["/ui/verification", options.project.verification_ui_url],
    ["/ui/settings", options.project.settings_ui_url],
    ["/ui/welcome", options.project.default_redirect_url],
    ["/recovery", options.project.recovery_ui_url],
    ["/registration", options.project.registration_ui_url],
    ["/login", options.project.login_ui_url],
    ["/verification", options.project.verification_ui_url],
    ["/settings", options.project.settings_ui_url],
  ]

  for (const [sdkPath, appPath] of routes) {
    const match = joinUrlPaths(sdkUrl, sdkPath)
    if (appPath && source.includes(match)) {
      source = source.replaceAll(match, new URL(appPath, appUrl).toString())
    }
  }

  return source
}

export function rewriteUrls(
  source: string,
  sdkUrl: string,
  appUrl: string,
  options: OryMiddlewareOptions,
): string {
  source = rewriteConfiguredUiRoutes(source, sdkUrl, appUrl, options)

  return source.replaceAll(sdkUrl.replace(/\/$/, ""), appUrl.replace(/\/$/, ""))
}
