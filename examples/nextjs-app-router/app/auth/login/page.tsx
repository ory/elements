// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Login } from "@ory/elements-react/theme"
import { enhanceOryConfig } from "@ory/nextjs"
import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"

import baseConfig from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const config = enhanceOryConfig(baseConfig)
  const flow = await getLoginFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Login
      flow={flow}
      config={config}
      components={{
        Card: {},
      }}
    />
  )
}
