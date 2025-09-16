// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardProps } from "@ory/elements-react"
import { Badge } from "./badge"
import { DefaultCardContent } from "./content"
import { DefaultCardFooter } from "./footer"
import { DefaultCardHeader } from "./header"
import { DefaultCardLogo } from "./logo"
import { DefaultCurrentIdentifierButton } from "./current-identifier-button"
import { ComponentPropsWithoutRef } from "react"
import { cn } from "../../utils/cn"

/**
 * The DefaultCard component is a styled container that serves as the main card layout for Ory Elements.
 *
 * @param props - The properties for the DefaultCard component.
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultCard({
  children,
  className,
  ...rest
}: OryCardProps & ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("ory-elements", className)} {...rest}>
      <div className="flex w-full flex-1 items-start justify-center font-sans-default sm:w-[480px] sm:max-w-[480px] sm:items-center">
        <div className="relative grid w-full grid-cols-1 gap-8 border-b border-form-border-default bg-form-background-default px-8 py-12 sm:rounded-cards sm:border sm:px-12 sm:py-14">
          {children}
          <Badge />
        </div>
      </div>
    </div>
  )
}

export {
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
  DefaultCurrentIdentifierButton,
}
