// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Registration } from "@ory/elements-react/theme"
import { oryPageRouterConfig, useRegistrationFlow } from "@ory/nextjs/pages"
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
        config={oryPageRouterConfig(config)}
        components={{
          Card: {},
        }}
      />
    </div>
  )
}
