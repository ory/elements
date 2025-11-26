// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Recovery } from "@ory/elements-react/theme"
import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"
import { myCustomComponents } from "@/components"
import config from "@/ory.config"

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Recovery flow={flow} config={config} components={myCustomComponents} />
  )
}
