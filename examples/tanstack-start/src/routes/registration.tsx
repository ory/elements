// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Registration } from "@ory/elements-react/theme"
import { createFileRoute } from "@tanstack/react-router"
import { registrationFlowFn } from "../ory.functions"
import config from "../ory.config"

export const Route = createFileRoute("/registration")({
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => registrationFlowFn({ data: deps }),
  component: RegistrationPage,
})

function RegistrationPage() {
  const flow = Route.useLoaderData()

  return (
    <main className="page">
      <Registration flow={flow} config={config} components={{ Card: {} }} />
    </main>
  )
}
