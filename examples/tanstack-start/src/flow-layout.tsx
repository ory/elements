// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from "react"

export function FlowLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      {children}
    </main>
  )
}
