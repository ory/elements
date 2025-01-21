// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@ory/elements-react/theme"
import { enhanceOryConfig } from "@ory/nextjs"
import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
import CustomCardHeader from "@/components/custom-card-header"

import baseConfig from "@/ory.config"

export default async function VerificationPage(props: OryPageParams) {
  const config = enhanceOryConfig(baseConfig)
  const flow = await getVerificationFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Verification
      flow={flow}
      config={config}
      components={{
        Card: {
          Header: CustomCardHeader,
        },
      }}
    />
  )
}
