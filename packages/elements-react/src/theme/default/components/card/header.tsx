// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardHeaderProps, useComponents } from "@ory/elements-react"
import { DefaultCurrentIdentifierButton } from "./current-identifier-button"

export function DefaultCardHeader({ title, text }: OryCardHeaderProps) {
  const { Card } = useComponents()
  return (
    <header className="flex flex-col gap-8 antialiased">
      <Card.Logo />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold leading-normal text-interface-foreground-default-primary">
          {title}
        </h2>
        {text && (
          <p className="leading-normal text-interface-foreground-default-secondary">
            {text}
          </p>
        )}
        <DefaultCurrentIdentifierButton />
      </div>
    </header>
  )
}
