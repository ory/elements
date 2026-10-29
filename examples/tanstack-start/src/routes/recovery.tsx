// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Recovery } from "@ory/elements-react/theme"
import { createFileRoute } from "@tanstack/react-router"
import { recoveryFlowFn } from "../ory.functions"
import config from "../ory.config"

export const Route = createFileRoute("/recovery")({
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => recoveryFlowFn({ data: deps }),
  component: RecoveryPage,
})

function RecoveryPage() {
  const flow = Route.useLoaderData()

  return (
    <main className="page">
      <Recovery flow={flow} config={config} components={{ Card: {} }} />
    </main>
  )
}
