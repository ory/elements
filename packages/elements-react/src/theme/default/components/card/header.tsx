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
        <h2 className="font-semibold text-lg text-dialog-fg-default leading-normal">
          {title}
        </h2>
        <p className="text-sm leading-normal text-dialog-fg-subtle">{text}</p>
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
