// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryElementsConfiguration } from "@ory/elements-react"

export function DefaultCardLogo() {
  const config = useOryElementsConfiguration()

  if (config.project.logo_light_url) {
    return (
      <img
        src={config.project.logo_light_url}
        width={100}
        height={36}
        alt="Logo"
      />
    )
  }

  return (
    <h1 className="text-xl font-semibold leading-normal text-interface-foreground-default-primary">
      {config.project.name}
    </h1>
  )
}
