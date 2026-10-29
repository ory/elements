// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Recovery } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getRecoveryFlow } from "@ory/react-router"
import type { Route } from "./+types/recovery"
import config from "../ory.config"

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  return {
    flow: await getRecoveryFlow(request, config),
  }
}

export default function RecoveryPage({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <Recovery
        flow={loaderData.flow}
        config={config}
        components={{ Card: {} }}
      />
    </main>
  )
}
