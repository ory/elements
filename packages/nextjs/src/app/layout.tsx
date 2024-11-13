// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { PropsWithChildren } from "react"

import "@ory/elements-react/theme/styles.css"

export default async function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
      {children}
    </main>
  )
}
