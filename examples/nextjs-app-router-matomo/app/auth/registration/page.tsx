// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"
import OryFlowWithMatomo from "@/components/ory-flow-with-matomo"

import config from "@/ory.config"

export default async function RegistrationPage(props: OryPageParams) {
  const flow = await getRegistrationFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <OryFlowWithMatomo
      flowType="registration"
      flow={flow}
      components={{
        Card: {},
      }}
    />
  )
}
