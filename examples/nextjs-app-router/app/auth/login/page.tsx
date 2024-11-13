// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Login } from "@ory/elements-react/theme"
import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"
import { enhanceConfig } from "@ory/nextjs"

import config from "@/ory.config"
import CardHeader from "@/app/auth/login/card-header"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Login
      flow={flow}
      config={enhanceConfig(config)}
      components={{
        Card: {
          Header: CardHeader,
        },
      }}
    />
  )
}
