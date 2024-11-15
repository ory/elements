// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Registration } from "@ory/elements-react/theme"
import { enhanceConfig } from "@ory/nextjs"
import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function RegistrationPage(props: OryPageParams) {
  const flow = await getRegistrationFlow(props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Registration
      flow={flow}
      config={enhanceConfig(config)}
      components={{
        Card: {},
      }}
    />
  )
}
