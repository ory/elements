// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Registration } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { useRegistrationFlow } from "@ory/nextjs/pages"

import config from "@/ory.config"

export default function RegistrationPage() {
  const flow = useRegistrationFlow()

  if (!flow) {
    return null
  }

  return (
    <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
      <Registration
        flow={flow}
        config={config}
        components={{
          Card: {},
        }}
      />
    </main>
  )
}
