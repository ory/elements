// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import React from "react"
import Link from "next/link"
import { useSession } from "@ory/elements-react/client"

export default function Home() {
  const { session } = useSession()
  if (session) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return "Hello: " + session.identity?.traits.email
  }
  return (
    <p>
      Not authenticated, please <Link href={"/ui/login"}>log in</Link>.
    </p>
  )
}
