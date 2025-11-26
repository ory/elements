// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@ory/elements-react/theme"
import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
import { myCustomComponents } from "@/components"
import config from "@/ory.config"

export default async function VerificationPage(props: OryPageParams) {
  const flow = await getVerificationFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Verification flow={flow} config={config} components={myCustomComponents} />
  )
}
