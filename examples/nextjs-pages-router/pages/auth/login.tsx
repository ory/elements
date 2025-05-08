// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { DefaultCardLayout, Login } from "@ory/elements-react/theme"
import { useLoginFlow } from "@ory/nextjs/pages"
import "@ory/elements-react/theme/styles.css"

import config from "@/ory.config"

export default function LoginPage() {
  const flow = useLoginFlow()

  if (!flow) {
    return null
  }

  return (
    <DefaultCardLayout>
      <Login
        flow={flow}
        config={config}
        components={{
          Card: {},
        }}
      />
    </DefaultCardLayout>
  )
}
