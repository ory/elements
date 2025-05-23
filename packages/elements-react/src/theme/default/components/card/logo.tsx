// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryConfiguration } from "@ory/elements-react"

export function DefaultCardLogo() {
  const config = useOryConfiguration()

  if (config.project.logo_light_url) {
    return (
      <img src={config.project.logo_light_url} className="h-full" alt="Logo" />
    )
  }

  return (
    <h1 className="text-xl font-semibold leading-normal text-interface-foreground-default-primary">
      {config.project.name}
    </h1>
  )
}
