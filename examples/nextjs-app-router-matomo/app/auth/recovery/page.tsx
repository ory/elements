// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"
import OryFlowWithMatomo from "@/components/ory-flow-with-matomo"
import CustomCardHeader from "@/components/custom-card-header"

import config from "@/ory.config"

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <OryFlowWithMatomo
      flowType="recovery"
      flow={flow}
      components={{
        Card: {
          Header: CustomCardHeader,
        },
      }}
    />
  )
}
