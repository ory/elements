// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { PropsWithChildren } from "react"

export function DefaultAuthMethodListContainer({
  children,
}: PropsWithChildren) {
  return <div className="grid grid-cols-1 gap-2">{children}</div>
}
