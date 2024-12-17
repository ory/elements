// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useOryFlow } from "@ory/elements-react"
import { useCardHeaderText } from "../../utils/constructCardHeader"
import { DefaultCurrentIdentifierButton } from "./current-identifier-button"

function InnerCardHeader({ title, text }: { title: string; text?: string }) {
  const { Card } = useComponents()
  return (
    <header className="flex flex-col gap-8 antialiased">
      <Card.Logo />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold leading-normal text-interface-foreground-default-primary">
          {title}
        </h2>
        <p className="leading-normal text-interface-foreground-default-secondary">
          {text}
        </p>
        <DefaultCurrentIdentifierButton />
      </div>
    </header>
  )
}

export function DefaultCardHeader() {
  const context = useOryFlow()
  const { title, description } = useCardHeaderText(context.flow.ui, context)

  return <InnerCardHeader title={title} text={description} />
}
