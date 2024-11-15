// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Recovery } from "@ory/elements-react/theme"
import { useRecoveryFlow } from "@ory/nextjs/pages"
import { enhanceConfig } from "@ory/nextjs"
import "@ory/elements-react/theme/styles.css"

import config from "@/ory.config"

export default function RecoveryPage() {
  const flow = useRecoveryFlow()

  if (!flow) {
    return null
  }

  return (
    <div className="pt-4">
      <Recovery
        flow={flow}
        config={enhanceConfig(config)}
        components={{
          Card: {},
        }}
      />
    </div>
  )
}
