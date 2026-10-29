// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getVerificationFlow } from "@ory/react-router"
import type { Route } from "./+types/verification"
import config from "../ory.config"

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  return {
    flow: await getVerificationFlow(request, config),
  }
}

export default function VerificationPage({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <Verification
        flow={loaderData.flow}
        config={config}
        components={{ Card: {} }}
      />
    </main>
  )
}
