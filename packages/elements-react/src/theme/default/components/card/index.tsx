// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardProps } from "@ory/elements-react"
import { Badge } from "./badge"
import { DefaultCardContent } from "./content"
import { DefaultCardFooter } from "./footer"
import { DefaultCardHeader } from "./header"
import { DefaultCardLogo } from "./logo"
import { DefaultCurrentIdentifierButton } from "./current-identifier-button"
import { DefaultCardLayout } from "./layout"

export function DefaultCard({ children }: OryCardProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <div className="relative grid max-w-sm grid-cols-1 gap-8 rounded-cards border border-form-border-default bg-form-background-default px-8 py-12 md:w-[480px] md:max-w-[480px] md:px-12 md:py-14">
        {children}
        <Badge />
      </div>
    </div>
  )
}

export {
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
  DefaultCardLayout,
  DefaultCurrentIdentifierButton,
}
