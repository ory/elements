// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryNodeTextProps,
  UiNodeInput,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { useIntl } from "react-intl"
import { DefaultLabel } from "./label"
import { DefaultInput } from "./input"
import { UiNodeInputAttributes } from "@ory/client-fetch"

export function DefaultText({ node }: OryNodeTextProps) {
  const intl = useIntl()

  if (node.attributes.id === "totp_secret_key") {
    // This node represents the TOTP secret key and needs special handling

    return (
      <DefaultLabel
        // TODO(jonas): This is pretty ugly, the type is incorrect, because the label always expects input node, but we're rendering a text node here
        node={node as unknown as UiNodeInput}
        attributes={node.attributes as unknown as UiNodeInputAttributes}
      >
        <div className="relative flex max-w-[488px] justify-stretch">
          <DefaultInput.TextInput
            disabled
            name="totp_secret_key"
            type="text"
            value={node.attributes.text.text}
            data-testid={`ory/form/node/input/totp_secret_key`}
          />
        </div>
      </DefaultLabel>
    )
  }

  if (node.attributes.id === "lookup_secret_codes") {
    // TODO (jonas): We might want to handle this more gracefully in the future
    // This node is rendered by the settings directly, so we don't need to render it here.
    // The problem is that it would cause an exception in the translation system, because
    // this node has an array of nodes in its context.
    throw new Error("node `lookup_secret_codes` cannot be rendered as text")
  }

  return (
    <p
      data-testid={`ory/form/node/text/${node.attributes.id}/label`}
      id={node.attributes.id}
    >
      {node.meta.label ? (
        <label>{uiTextToFormattedMessage(node.meta.label, intl)}</label>
      ) : null}
      {node.attributes.text
        ? uiTextToFormattedMessage(node.attributes.text, intl)
        : ""}
    </p>
  )
}
