// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SessionProvider } from "@ory/elements-react/client"
import { Settings } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import {
  getOryBaseUrl,
  getServerSession,
  getSettingsFlow,
} from "@ory/react-router"
import type { Route } from "./+types/settings"
import config from "../ory.config"

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  const [flow, session] = await Promise.all([
    getSettingsFlow(request, config),
    getServerSession(request),
  ])
  return { flow, session, baseUrl: getOryBaseUrl(request) }
}

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <SessionProvider
        session={loaderData.session}
        baseUrl={loaderData.baseUrl}
      >
        <Settings
          flow={loaderData.flow}
          config={config}
          components={{ Card: {} }}
        />
      </SessionProvider>
    </main>
  )
}
