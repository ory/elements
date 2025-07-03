// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Verification } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { useVerificationFlow } from "@ory/nextjs/pages"

import config from "@/ory.config"

export default function VerificationPage() {
  const flow = useVerificationFlow()

  if (!flow) {
    return null
  }

  return (
    <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
      <Verification
        flow={flow}
        config={config}
        components={{
          Card: {},
        }}
      />
    </main>
  )
}
