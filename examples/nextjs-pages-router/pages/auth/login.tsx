// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Login } from "@ory/elements-react/theme"
import { useLoginFlow } from "@ory/nextjs/pages"
import { enhanceConfig } from "@ory/nextjs"
import "@ory/elements-react/theme/styles.css"

import config from "@/ory.config"

export default function LoginPage() {
  const flow = useLoginFlow()

  if (!flow) {
    return null
  }

  return (
    <div className="pt-4">
      <Login
        flow={flow}
        config={enhanceConfig(config)}
        components={{
          Card: {},
        }}
      />
    </div>
  )
}
