// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Error as ErrorComponent } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getError, getServerSession } from "@ory/react-router"
import type { Route } from "./+types/error"
import config from "../ory.config"

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  const [error, session] = await Promise.all([
    getError(request),
    getServerSession(request),
  ])
  return { error, session }
}

export default function ErrorPage({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <ErrorComponent
        error={loaderData.error}
        config={config}
        components={{ Card: {} }}
        session={loaderData.session ?? undefined}
      />
    </main>
  )
}
