// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Registration } from "@ory/elements-react/theme"
import { useRegistrationFlow } from "@ory/nextjs/pages"
import { enhanceOryConfig } from "@ory/nextjs"
import "@ory/elements-react/theme/styles.css"

import config from "@/ory.config"

export default function RegistrationPage() {
  const flow = useRegistrationFlow()

  if (!flow) {
    return null
  }

  return (
    <div className="pt-4">
      <Registration
        flow={flow}
        config={enhanceOryConfig(config)}
        components={{
          Card: {},
        }}
      />
    </div>
  )
}
