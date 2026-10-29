// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Error as ErrorComponent } from "@ory/elements-react/theme"
import { createFileRoute } from "@tanstack/react-router"
import { errorFn, sessionFn } from "../ory.functions"
import config from "../ory.config"

export const Route = createFileRoute("/error")({
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({
    error: await errorFn({ data: deps }),
    session: await sessionFn(),
  }),
  component: ErrorPage,
})

function ErrorPage() {
  const { error, session } = Route.useLoaderData()

  return (
    <main className="page">
      <ErrorComponent
        error={error}
        config={config}
        components={{ Card: {} }}
        session={session ?? undefined}
      />
    </main>
  )
}
