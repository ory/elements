// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getLogoutFlow, getServerSession } from "@ory/react-router"
import { Link } from "react-router"
import type { Route } from "./+types/home"

export function meta() {
  return [{ title: "Ory React Router Example" }]
}

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getServerSession(request)
  if (!session) {
    return { session: null, logoutUrl: null }
  }
  const logout = await getLogoutFlow(request)
  return { session, logoutUrl: logout.logout_url }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { session, logoutUrl } = loaderData
  const traits = session?.identity?.traits as
    | { email?: string; username?: string; phone?: string }
    | undefined

  return (
    <main>
      <h1>Ory React Router Example</h1>
      {session ? (
        <div className="links">
          <h2>Hi, {traits?.email ?? traits?.username ?? traits?.phone}!</h2>
          <Link to="/settings">Settings</Link>
          {logoutUrl && <a href={logoutUrl}>Logout</a>}
        </div>
      ) : (
        <div className="links">
          <Link to="/auth/registration">Registration</Link>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/recovery">Account Recovery</Link>
          <Link to="/auth/verification">Account Verification</Link>
        </div>
      )}
    </main>
  )
}
