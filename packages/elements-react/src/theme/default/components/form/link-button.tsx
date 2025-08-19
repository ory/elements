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
import { omitInputAttributes } from "../../../../util/omitAttributes"

export const DefaultLinkButton = forwardRef<
  HTMLAnchorElement,
  OryNodeAnchorProps
>(({ attributes, node }, ref) => {
  const intl = useIntl()
  const label = getNodeLabel(node)
  return (
    <a
      {...omitInputAttributes(attributes)}
      ref={ref}
      title={label ? uiTextToFormattedMessage(label, intl) : ""}
      data-testid={`ory/form/node/link/${attributes.id}`}
      className={cn(
        "cursor-pointer gap-3 border bg-button-primary-background-default p-4 text-center leading-none font-medium text-button-primary-foreground-default antialiased transition-colors hover:bg-button-primary-background-hover hover:text-button-primary-foreground-hover",
      )}
    >
      {label ? uiTextToFormattedMessage(label, intl) : ""}
    </a>
  )
})

DefaultLinkButton.displayName = "DefaultLinkButton"
