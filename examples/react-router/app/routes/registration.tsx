// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Registration } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getRegistrationFlow } from "@ory/react-router"
import type { Route } from "./+types/registration"
import config from "../ory.config"

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  return {
    flow: await getRegistrationFlow(request, config),
  }
}

export default function RegistrationPage({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <Registration
        flow={loaderData.flow}
        config={config}
        components={{ Card: {} }}
      />
    </main>
  )
}
