// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeAnchorProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { forwardRef } from "react"
import { useIntl } from "react-intl"
import { cn } from "../../utils/cn"

export const DefaultLinkButton = forwardRef<
  HTMLAnchorElement,
  OryNodeAnchorProps
>(({ attributes, node }, ref) => {
  const intl = useIntl()
  const label = getNodeLabel(node)
  return (
    <a
      {...attributes}
      ref={ref}
      title={label ? uiTextToFormattedMessage(label, intl) : ""}
      data-testid={`ory/form/node/link/${attributes.id}`}
      className={cn(
        "antialiased rounded cursor-pointer text-center border gap-3 leading-none bg-button-primary-background-default hover:bg-button-primary-background-hover transition-colors text-button-primary-foreground-default hover:text-button-primary-foreground-hover p-4 font-medium",
      )}
    >
      {label ? uiTextToFormattedMessage(label, intl) : ""}
    </a>
  )
})

DefaultLinkButton.displayName = "DefaultLinkButton"
