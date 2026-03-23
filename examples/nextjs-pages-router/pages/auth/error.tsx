// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { Error as ErrorComponent } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { useRouter } from "next/router"

import config from "@/ory.config"
import { useError } from "@ory/nextjs/pages"

export default function ErrorPage() {
  const router = useRouter()

  const error = useError(router.query)

  if (!error) {
    return null
  }

  return (
    <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
      <ErrorComponent error={error} config={config} components={{ Card: {} }} />
    </main>
  )
}
