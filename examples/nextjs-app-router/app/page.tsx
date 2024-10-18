"use client"
import { useSession } from "@ory/nextjs/hooks"
import Link from "next/link"

export default function RootLayout() {
  const session = useSession()
  if (session) {
    return "Hello: " + session.identity?.traits.email
  }
  return (
    <p>
      Not authenticated, please <Link href={"/auth/login"}>log in</Link>.
    </p>
  )
}
