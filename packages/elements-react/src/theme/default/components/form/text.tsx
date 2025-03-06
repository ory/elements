// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { OryNodeTextProps, uiTextToFormattedMessage } from "@ory/elements-react"
import { useIntl } from "react-intl"

export function DefaultText({ node, attributes }: OryNodeTextProps) {
  const intl = useIntl()

  // There is a special case where this node is the lookup secrets code node. In that case we need special formatting:
  const lookup = (
    attributes.text.context as {
      secrets: UiText[]
    }
  )?.secrets

  if (lookup) {
    return (
      <>
        <p data-testid={`ory/form/node/text/${attributes.id}/label`}>
          {node.meta.label
            ? uiTextToFormattedMessage(node.meta.label, intl)
            : ""}
        </p>
        {lookup.map((text: UiText, index) => (
          <pre
            data-testid={`ory/form/node/text/lookup_secret_codes/text`}
            key={index}
          >
            <code>{text ? uiTextToFormattedMessage(text, intl) : ""}</code>
          </pre>
        ))}
      </>
    )
  }

  return (
    <>
      <p
        data-testid={`ory/form/node/text/${attributes.id}/label`}
        id={attributes.id}
      >
        {node.meta.label ? (
          <label>{uiTextToFormattedMessage(node.meta.label, intl)}</label>
        ) : null}
        {attributes.text ? uiTextToFormattedMessage(attributes.text, intl) : ""}
      </p>
    </>
  )
}
