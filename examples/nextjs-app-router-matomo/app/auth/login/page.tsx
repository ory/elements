// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"
import OryFlowWithMatomo from "@/components/ory-flow-with-matomo"

import config from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <OryFlowWithMatomo
      flowType="login"
      flow={flow}
      components={{
        Card: {},
      }}
    />
  )
}
