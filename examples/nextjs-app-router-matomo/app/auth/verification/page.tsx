// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
import OryFlowWithMatomo from "@/components/ory-flow-with-matomo"
import CustomCardHeader from "@/components/custom-card-header"

import config from "@/ory.config"

export default async function VerificationPage(props: OryPageParams) {
  const flow = await getVerificationFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <OryFlowWithMatomo
      flowType="verification"
      flow={flow}
      components={{
        Card: {
          Header: CustomCardHeader,
        },
      }}
    />
  )
}
