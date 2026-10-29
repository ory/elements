// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Login } from "@ory/elements-react/theme"
import { createFileRoute } from "@tanstack/react-router"
import { loginFlowFn } from "../ory.functions"
import config from "../ory.config"

export const Route = createFileRoute("/login")({
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loginFlowFn({ data: deps }),
  component: LoginPage,
})

function LoginPage() {
  const flow = Route.useLoaderData()

  return (
    <main className="page">
      <Login flow={flow} config={config} components={{ Card: {} }} />
    </main>
  )
}
