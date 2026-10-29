// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SessionProvider } from "@ory/elements-react/client"
import { Settings } from "@ory/elements-react/theme"
import { createFileRoute } from "@tanstack/react-router"
import { settingsFlowFn } from "../ory.functions"
import config from "../ory.config"
import { useOryBaseUrl } from "../use-ory-base-url"

export const Route = createFileRoute("/settings")({
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => settingsFlowFn({ data: deps }),
  component: SettingsPage,
})

function SettingsPage() {
  const flow = Route.useLoaderData()
  const baseUrl = useOryBaseUrl()

  return (
    <main className="page">
      <SessionProvider baseUrl={baseUrl}>
        <Settings flow={flow} config={config} components={{ Card: {} }} />
      </SessionProvider>
    </main>
  )
}
