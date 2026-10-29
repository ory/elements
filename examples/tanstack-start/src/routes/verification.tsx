// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@ory/elements-react/theme"
import { createFileRoute } from "@tanstack/react-router"
import { verificationFlowFn } from "../ory.functions"
import config from "../ory.config"

export const Route = createFileRoute("/verification")({
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => verificationFlowFn({ data: deps }),
  component: VerificationPage,
})

function VerificationPage() {
  const flow = Route.useLoaderData()

  return (
    <main className="page">
      <Verification flow={flow} config={config} components={{ Card: {} }} />
    </main>
  )
}
