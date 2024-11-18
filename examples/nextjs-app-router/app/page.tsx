// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { useSession } from "@ory/elements-react/client"
import Link from "next/link"

export default function RootLayout() {
  const { session } = useSession()
  if (session) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return "Hello: " + session.identity?.traits.email
  }
  return (
    <p>
      Not authenticated, please <Link href={"/auth/login"}>log in</Link>.
    </p>
  )
}
