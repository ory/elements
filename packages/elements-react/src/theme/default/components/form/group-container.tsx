// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryFormGroupProps, useOryFlow } from "@ory/elements-react"
import { cn } from "../../utils/cn"
import { FlowType } from "@ory/client-fetch"

export function DefaultGroupContainer({ children }: OryFormGroupProps) {
  const { flowType } = useOryFlow()
  return (
    <div
      className={cn(
        "grid",
        flowType === FlowType.OAuth2Consent
          ? "grid-cols-2 gap-2"
          : "grid-cols-1 gap-8",
      )}
    >
      {children}
    </div>
  )
}
