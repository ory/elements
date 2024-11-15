// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@ory/elements-react/theme"
import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
import { enhanceConfig } from "@ory/nextjs"

import config from "@/ory.config"
import CustomCardHeader from "@/components/custom-card-header"

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
