// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Registration } from "@ory/elements-react/theme"
import { enhanceOryConfig } from "@ory/nextjs"
import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"

import baseConfig from "@/ory.config"

export default async function RegistrationPage(props: OryPageParams) {
  const config = enhanceOryConfig(baseConfig)
  const flow = await getRegistrationFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Registration
      flow={flow}
      config={config}
      components={{
        Card: {},
      }}
    />
  )
}
