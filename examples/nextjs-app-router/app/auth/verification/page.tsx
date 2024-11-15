// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@ory/elements-react/theme"
import { enhanceConfig } from "@ory/nextjs"
import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"

import CustomCardHeader from "@/components/custom-card-header"
import config from "@/ory.config"

export default async function VerificationPage(props: OryPageParams) {
  const flow = await getVerificationFlow(props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Verification
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
