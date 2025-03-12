// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeImageProps } from "@ory/elements-react"

export function DefaultImage({ attributes, node }: OryNodeImageProps) {
  console.log(node)
  return (
    <figure>
      <img {...attributes} alt={node.meta.label?.text} />
    </figure>
  )
}
