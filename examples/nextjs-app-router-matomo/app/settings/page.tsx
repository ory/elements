// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SessionProvider } from "@ory/elements-react/client"
import { getSettingsFlow, OryPageParams } from "@ory/nextjs/app"
import "@ory/elements-react/theme/styles.css"
import OryFlowWithMatomo from "@/components/ory-flow-with-matomo"

import config from "@/ory.config"

export default async function SettingsPage(props: OryPageParams) {
  const flow = await getSettingsFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <div className="flex flex-col gap-8 items-center mb-8">
      <SessionProvider>
        <OryFlowWithMatomo
          flowType="settings"
          flow={flow}
          components={{
            Card: {},
          }}
        />
      </SessionProvider>
    </div>
  )
}
