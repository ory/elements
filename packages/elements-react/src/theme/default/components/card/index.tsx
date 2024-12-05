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
    <div className="flex-1 flex-col flex justify-center items-center font-sans">
      <div className="grid grid-cols-1 max-w-sm md:max-w-[480px] md:w-[480px] gap-8 bg-dialog-bg-default px-8 md:px-12 py-12 md:py-14 relative rounded-border-radius-cards border border-dialog-border-default">
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
