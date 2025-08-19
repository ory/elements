// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryConfiguration } from "@ory/elements-react"

/**
 * The DefaultCardLogo component renders the logo from the {@link @ory/elements-react!OryProvider} or falls back to the project name.
 *
 * @returns the default logo for the Ory Card component.
 * @group Components
 * @category Default Components
 * @see {@link @ory/elements-react!OryProvider}
 * @see {@link @ory/elements-react!OryElementsConfiguration}
 */
export function DefaultCardLogo() {
  const config = useOryConfiguration()

  if (config.project.logo_light_url) {
    return (
      <img
        src={config.project.logo_light_url}
        className="h-full max-h-9 self-start"
        alt="Logo"
      />
    )
  }

  return (
    <h1 className="text-xl leading-normal font-semibold text-interface-foreground-default-primary">
      {config.project.name}
    </h1>
  )
}
