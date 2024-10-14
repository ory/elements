// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryFlow } from "@ory/elements-react"

export function DefaultCardLogo() {
  const flow = useOryFlow()

  if (flow.config.logoUrl) {
    return <img src={flow.config.logoUrl} width={100} height={36} alt="Logo" />
  }

  return (
    <h1
      className={"text-xl font-semibold leading-normal text-dialog-fg-default"}
    >
      {flow.config.name}
    </h1>
  )
}
