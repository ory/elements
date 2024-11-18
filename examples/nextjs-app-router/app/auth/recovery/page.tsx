// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Recovery } from "@ory/elements-react/theme"
import { enhanceConfig } from "@ory/nextjs"
import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"

import CustomCardHeader from "@/components/custom-card-header"
import config from "@/ory.config"

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Recovery
      flow={flow}
      config={enhanceConfig(config)}
      components={{
        Card: {
          Header: CustomCardHeader,
        },
      }}
    />
  )
}
