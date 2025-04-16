// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeImageProps } from "@ory/elements-react"
import { omitInputAttributes } from "../../../../util/omitAttributes"

export function DefaultImage({ attributes, node }: OryNodeImageProps) {
  return (
    <figure>
      <img
        {...omitInputAttributes(attributes)}
        alt={node.meta.label?.text || ""}
      />
    </figure>
  )
}
