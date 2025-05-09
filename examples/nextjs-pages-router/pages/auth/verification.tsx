// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { DefaultCardLayout, Verification } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { useVerificationFlow } from "@ory/nextjs/pages"

import config from "@/ory.config"

export default function VerificationPage() {
  const flow = useVerificationFlow()

  if (!flow) {
    return null
  }

  return (
    <DefaultCardLayout>
      <Verification
        flow={flow}
        config={config}
        components={{
          Card: {},
        }}
      />
    </DefaultCardLayout>
  )
}
