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
    <div className="flex flex-1 sm:items-center justify-center font-sans items-start w-full sm:w-[480px] sm:max-w-[480px]">
      <div className="relative grid grid-cols-1 gap-8 sm:rounded-cards sm:border border-form-border-default bg-form-background-default px-8 py-12 sm:px-12 sm:py-14 border-b w-full">
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
