// SPDX-License-Identifier: Apache-2.0

import { SessionProvider } from "@ory/elements-react/client"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getOry } from "../ory.server"

const loadHome = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest()
  const ory = getOry()
  const session = await ory.getSession({ request })

  return {
    sdkUrl: ory.getBrowserSdkUrl({ request }),
    session,
    logoutUrl: session
      ? (await ory.getLogoutFlow({ request })).logout_url
      : null,
  }
})

export const Route = createFileRoute("/")({
  loader: () => loadHome(),
  component: Home,
})

function Home() {
  const { logoutUrl, sdkUrl, session } = Route.useLoaderData()
  const traits = session?.identity?.traits as
    | Record<string, unknown>
    | null
    | undefined
  const identityLabel = [traits?.email, traits?.username, traits?.phone].find(
    (value): value is string => typeof value === "string" && value.length > 0,
  )

  return (
    <SessionProvider session={session} baseUrl={sdkUrl}>
      <main style={{ margin: "4rem auto", maxWidth: 640, padding: "0 1rem" }}>
        <h1>Ory Elements for TanStack Start</h1>
        <p>
          This example keeps server SDK calls private and proxies browser Ory
          requests through the application when the SDK is cross-site.
        </p>
        {!session ? (
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <a href="/auth/login">Sign in</a>
            <a href="/auth/registration">Register</a>
            <a href="/auth/recovery">Recover account</a>
            <a href="/auth/verification">Verify account</a>
          </nav>
        ) : (
          <section>
            <p>
              Signed in as {identityLabel ?? session.identity?.id ?? "user"}.
            </p>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <a href="/settings">Account settings</a>
              {logoutUrl ? <a href={logoutUrl}>Sign out</a> : null}
            </nav>
          </section>
        )}
      </main>
    </SessionProvider>
  )
}
