// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Login } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getLoginFlow } from "@ory/react-router"
import type { Route } from "./+types/login"
import config from "../ory.config"

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  return {
    flow: await getLoginFlow(request, config),
  }
}

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <Login flow={loaderData.flow} config={config} components={{ Card: {} }} />
    </main>
  )
}
