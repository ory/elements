// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryNodeImageProps } from "@ory/elements-react"
import { omitInputAttributes } from "../../../../util/omitAttributes"

export function DefaultImage({ node }: OryNodeImageProps) {
  return (
    <figure>
      <img
        {...omitInputAttributes(node.attributes)}
        alt={node.meta.label?.text || ""}
      />
    </figure>
  )
}
