// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SessionProvider } from "@ory/elements-react/client"
import { createFileRoute, Link } from "@tanstack/react-router"
import { logoutFlowFn, sessionFn } from "../ory.functions"
import { useOryBaseUrl } from "../use-ory-base-url"

export const Route = createFileRoute("/")({
  loader: async () => {
    const session = await sessionFn()
    return {
      session,
      logoutUrl: session ? (await logoutFlowFn()).logout_url : undefined,
    }
  },
  component: HomePage,
})

function HomePage() {
  const { session, logoutUrl } = Route.useLoaderData()
  const baseUrl = useOryBaseUrl()
  const traits = session?.identity?.traits as
    | { email?: string; username?: string; phone?: string }
    | undefined

  return (
    <SessionProvider session={session} baseUrl={baseUrl}>
      <main className="page">
        <h1>Ory TanStack Start Example</h1>
        {!session && (
          <div className="card">
            <Link to="/registration">Registration</Link>
            <Link to="/login">Login</Link>
            <Link to="/recovery">Account Recovery</Link>
            <Link to="/verification">Account Verification</Link>
          </div>
        )}
        {session && (
          <div className="card">
            <h2>Hi, {traits?.email ?? traits?.username ?? traits?.phone}!</h2>
            <Link to="/settings">Settings</Link>
            <a href={logoutUrl}>Logout</a>
          </div>
        )}
      </main>
    </SessionProvider>
  )
}
