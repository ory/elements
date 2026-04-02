// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL ?? ""
const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "1"

/**
 * Send a custom event to Matomo using the HTTP Tracking API.
 *
 * @see https://developer.matomo.org/api-reference/tracking-api
 */
export function trackEvent(
  category: string,
  action: string,
  name?: string,
  value?: number,
): void {
  if (!matomoUrl) {
    return
  }

  const params = new URLSearchParams({
    idsite: siteId,
    rec: "1",
    e_c: category,
    e_a: action,
    url: window.location.href,
    _random: String(Math.random()),
  })

  if (name) {
    params.set("e_n", name)
  }
  if (value !== undefined) {
    params.set("e_v", String(value))
  }

  fetch(`${matomoUrl}/matomo.php?${params.toString()}`, {
    mode: "no-cors",
  }).catch(() => {
    // Silently ignore tracking failures — analytics should never
    // break the application.
  })
}
