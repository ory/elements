// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import React from "react"
import Link from "next/link"
import { SessionProvider, useSession } from "@ory/elements-react/client"
import Image from "next/image"
import OryLogo from "./logo.svg"
import { useLogoutFlow } from "@ory/nextjs/pages"

function HomeContent() {
  const { session } = useSession()
  const traits = session?.identity?.traits as {
    email: string
    username: string
    phone: string
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Image src={OryLogo as string} alt="Ory Logo" width={160} />
        <h1 className="font-bold text-xl">Ory Next.js Pages Router Example</h1>
        {!session && (
          <div className="flex items-center gap-2 bg-white rounded border flex-col w-60 p-3">
            <Link className="underline block w-full" href="/auth/registration">
              Registration
            </Link>
            <Link className="underline block w-full" href="/auth/login">
              Login
            </Link>
            <Link className="underline block w-full" href="/auth/recovery">
              Account Recovery
            </Link>
            <Link className="underline block w-full" href="/auth/verification">
              Account Verification
            </Link>
          </div>
        )}
        {session && (
          <div className="flex items-center gap-2 bg-white rounded border flex-col w-60 p-3">
            <h2 className="w-full">
              Hi, {traits.email ?? traits.username ?? traits.phone}!
            </h2>
            <Link className="underline block w-full" href="/settings">
              Settings
            </Link>
            <LogoutLink />
          </div>
        )}
        <div className="flex gap-2 text-sm">
          <a
            href="https://github.com/ory/elements/tree/master/examples/nextjs-pages-router"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            App Router Example
          </a>
          <a
            href="https://github.com/ory/elements/tree/master/examples/nextjs-pages-router"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Page Router Example
          </a>
        </div>
      </div>
    </div>
  )
}

function LogoutLink() {
  const flow = useLogoutFlow()

  if (!flow) {
    return null
  }

  return (
    <a className="underline block w-full" href={flow.logout_url}>
      Logout
    </a>
  )
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  )
}
