// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { DefaultCardLayout, Recovery } from "@ory/elements-react/theme"
import { useRecoveryFlow } from "@ory/nextjs/pages"
import { enhanceOryConfig } from "@ory/nextjs"
import "@ory/elements-react/theme/styles.css"

import config from "@/ory.config"

export default function RecoveryPage() {
  const flow = useRecoveryFlow()

  if (!flow) {
    return null
  }

  return (
    <DefaultCardLayout>
      <Recovery
        flow={flow}
        config={enhanceOryConfig(config)}
        components={{
          Card: {},
        }}
      />
    </DefaultCardLayout>
  )
}
