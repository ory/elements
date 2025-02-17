// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryFormGroupProps } from "@ory/elements-react"

export function DefaultGroupContainer({ children }: OryFormGroupProps) {
  return <div className="grid grid-cols-1 gap-2">{children}</div>
}
