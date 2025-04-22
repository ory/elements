// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import config from "@/ory.config"
import { Settings } from "@ory/elements-react/theme"
import { enhanceOryConfig } from "@ory/nextjs"
import { useSettingsFlow } from "@ory/nextjs/pages"
import { SessionProvider } from "../../../packages/elements-react/dist/client/session-provider"

export default function SettingsPage() {
  const flow = useSettingsFlow()

  if (!flow) {
    return null
  }

  return (
    <div className="flex flex-col gap-8 items-center mb-8">
      <SessionProvider>
        <Settings
          flow={flow}
          config={enhanceOryConfig(config)}
          components={{
            Card: {},
          }}
        />
      </SessionProvider>
    </div>
  )
}
