// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Settings } from "@ory/elements-react/theme"
import { SessionProvider } from "@ory/elements-react/client"
import { enhanceOryConfig } from "@ory/nextjs"
import { getSettingsFlow, OryPageParams } from "@ory/nextjs/app"
import "@ory/elements-react/theme/styles.css"

import baseConfig from "@/ory.config"

export default async function SettingsPage(props: OryPageParams) {
  const config = enhanceOryConfig(baseConfig)
  const flow = await getSettingsFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <div className="flex flex-col gap-8 items-center mb-8">
      <SessionProvider>
        <Settings
          flow={flow}
          config={config}
          components={{
            Card: {},
          }}
        />
      </SessionProvider>
    </div>
  )
}
