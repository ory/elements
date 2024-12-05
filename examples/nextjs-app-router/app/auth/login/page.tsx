// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Login } from "@ory/elements-react/theme"
import { enhanceOryConfig } from "@ory/nextjs"
import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Login
      flow={flow}
      config={enhanceOryConfig(config)}
      components={{
        Card: {},
      }}
    />
  )
}
