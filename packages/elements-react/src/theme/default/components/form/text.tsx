// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { OryNodeTextProps, uiTextToFormattedMessage } from "@ory/elements-react"
import { useIntl } from "react-intl"

export function DefaultText({ node, attributes }: OryNodeTextProps) {
  const intl = useIntl()
  return (
    <>
      <p data-testid={`ory/form/node/text/${attributes.id}/label`}>
        {node.meta.label ? uiTextToFormattedMessage(node.meta.label, intl) : ""}
      </p>
      {(
        attributes.text.context as {
          secrets: UiText[]
        }
      ).secrets?.map((text: UiText, index) => (
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
